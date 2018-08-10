const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const isFalsey = require('falsey');
const Axios = require('axios');
const querystring = require('querystring');
// spotify stuffs
const SpotifyWebApi = require('spotify-web-api-node');
const PromiseThrottle = require('promise-throttle');
const promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 10,           // up to 1 request per second
    promiseImplementation: Promise  // the Promise library you are using
  });

// credentials are optional
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_CALLBACK,
});
// \ spotify stuffs

const {
    log_json, getErrorGif, encrypt, decrypt,
} = require('./utils_routes');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_CALLBACK;

router.get('/', (req, res) => {
    res.render('pages/festival/festival_index', {});
});

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

router.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    const qs = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private',
        state,
    });
    const login_url = `https://accounts.spotify.com/authorize?${qs}`;
    res.redirect(login_url);
});


router.get('/login/callback', (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(`/#${
            querystring.stringify({
                error: 'state_mismatch',
            })}`);
    } else {
        res.clearCookie(stateKey);

        const data = {
            code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        };
        const config = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: data,
            method: 'POST',
        };
        Axios(config)
            .then((token_res) => {
                const { access_token, refresh_token } = token_res.data;
                res.cookie('access_token', encrypt(access_token));
                res.cookie('refresh_token', encrypt(refresh_token));
                spotifyApi.setAccessToken(access_token);
                spotifyApi.setRefreshToken(refresh_token);
                // we can also pass the token to the browser to make requests from there
                res.redirect('/festival/create');
            })
            .catch((error) => {
                getErrorGif().then((errorImageUrl) => {
                    res.render('error', {
                        error,
                        errorImageUrl,
                    });
                });
            });
    }
});

router.get('/refresh_token', (req, res) => {
    // requesting access token from refresh token
    const { refresh_token } = req.query;
    const data = {
        grant_type: 'refresh_token',
        refresh_token,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    };
    const config = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: data,
        method: 'POST',
    };
    Axios(config)
        .then((token_res) => {
            const { access_token } = token_res;
            res.send({
                access_token,
            });
        });
});

router.get(('/create'), (req, res) => {
    res.render('pages/festival/festival_create', {
        extra_js: ['festival_create.bundle.js'],
    });
});
const get_artist_id_list = (artist_name_array) => {
    const artist_id_promise_list = artist_name_array
        .map(artist_name => artist_name.trim())
        .map((artist_name) => {
            return promiseThrottle.add(() => {
                return spotifyApi.searchArtists(artist_name).then((data) => {
                    let id = -1;
                    if (data.body.artists.items.length > 0) {
                        id = data.body.artists.items[0].id;
                    }
                    return id;
                })
                    .catch((err) => {
                        console.error(err);
                    });
            })
        });
            
    return Promise.all(artist_id_promise_list);
};

const get_song_by_artist_uri_list = (artist_id_array, song_count) => {
    const range = [];
    for (let i = 0; i < song_count; i++) {
        range.push(i);
    }
    const artist_id_promise_list = artist_id_array
        .filter(artist_id => artist_id !== -1)
        .map((artist_id) => {
            return promiseThrottle.add(() => {
                return spotifyApi.getArtistTopTracks(artist_id, 'US')
                .then(data => range.map(index => data.body.tracks[index].uri))
                .catch((err) => {
                    console.error(err);
                });
            });
        });
    return Promise.all(artist_id_promise_list);
};

router.post('/', async (req, res) => {
    // log_json(req.body);
    const { festival_name, artist_list, song_count } = req.body;
    const artist_name_array = artist_list.split('\n');

    spotifyApi.setAccessToken(decrypt(req.cookies.access_token));
    spotifyApi.setRefreshToken(decrypt(req.cookies.refresh_token));
    try {
        const artist_id_list = await get_artist_id_list(artist_name_array);
        const track_uri_list = await get_song_by_artist_uri_list(artist_id_list, song_count)
        const user_id = await spotifyApi.getMe().then(data => data.body.id);
        const new_playlist_id = await spotifyApi.createPlaylist(user_id, festival_name)
            .then(data => data.body.id);
        const foo = track_uri_list.reduce((acc, val) => acc.concat(val), []).filter(el => el !== undefined);
        const step = 50;
        let p = [];
        for (i = 0; i <= Math.ceil(foo.length/step); i++){
            let bar = foo.slice(i*step, Math.min(foo.length, (i+1) * step));
            console.log(bar.length, i, (i+1) * step);
            p.push(spotifyApi.addTracksToPlaylist(user_id, new_playlist_id, bar)
            .catch(err => log_json(err)));
        }
        Promise.all(p)
            .then(data => res.send({ success: true, data }))
            .catch(err => log_json(err));
    } catch (err) {
        log_json(err);
        res.status(500).send({ succcess: false, err });
    }
});

module.exports = router;
