const
    crypto = require('crypto');
const NodeCache = require('node-cache');
const rp = require('request-promise');
const config = require('./config');
import { Router, Request, Response, NextFunction } from 'express';

const mycache = new NodeCache();

// Returns a promise that fulfills when a new session is created
function regenerateSessionAsync(req: Request) {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) { reject(err); } else resolve();
        });
    });
}

// Returns a promise that fulfills when a session is destroyed
function destroySessionAsync(req: Request) {
    return new Promise(async (resolve, reject) => {
        try {
            // First ensure token gets revoked in Dropbox.com
            const options = {
                url: config.DBX_API_DOMAIN + config.DBX_TOKEN_REVOKE_PATH,
                headers: { Authorization: `Bearer ${req.session.token}` },
                method: 'POST',
            };
            await rp(options);
        } catch (error) {
            reject(new Error('error destroying token. '));
        }

        // then destroy the session
        req.session.destroy((err) => {
            if (err) { reject(err); } else resolve();
        });
    });
}


/*
Returns an object containing an array with the path_lower of each
image file and if more files a cursor to continue */
async function listImagePathsAsync(token: string, path, next: NextFunction) {
    const options = {
        url: config.DBX_API_DOMAIN + config.DBX_LIST_FOLDER_PATH,
        headers: { Authorization: `Bearer ${token}` },
        method: 'POST',
        json: true,
        body: { path },
    };

    try {
        // Make request to Dropbox to get list of files
        const result = await rp(options);

        // Filter response to images only
        const entriesFiltered = result.entries.filter((entry) => entry.path_lower.search(/\.(gif|jpg|jpeg|tiff|png)$/i) > -1);

        // Get an array from the entries with only the path_lower fields
        const paths = entriesFiltered.map((entry) => entry.path_lower);

        // return a cursor only if there are more files in the current folder
        const response = {};
        response["paths"] = paths;
        if (result.hasmore) response["cursor"] = result.cursor;
        return response;
    } catch (error) {
        return next(new Error(`error listing folder. ${error.message}`));
    }
}


// Returns an array with temporary links from an array with file paths
function getTemporaryLinksForPathsAsync(token: string, paths) {
    const promises = [];
    const options = {
        url: config.DBX_API_DOMAIN + config.DBX_GET_TEMPORARY_LINK_PATH,
        headers: { Authorization: `Bearer ${token}` },
        method: 'POST',
        json: true,
    };

    // Create a promise for each path and push it to an array of promises
    paths.forEach((path_lower) => {
        options["body"] = { path: path_lower };
        promises.push(rp(options));
    });

    // returns a promise that fullfills once all the promises in the array complete or one fails
    return Promise.all(promises);
}


/* Gets temporary links for a set of files in the root folder of the app
It is a two step process:
1.  Get a list of all the paths of files in the folder
2.  Fetch a temporary link for each file in the folder */
async function getLinksAsync(token: string, next: NextFunction) {
    // List images from the root of the app folder
    const result = await listImagePathsAsync(token, '', next);

    // Get a temporary link for each of those paths returned
    const temporaryLinkResults = await getTemporaryLinksForPathsAsync(token, result["paths"]);

    // Construct a new array only with the link field
    const temporaryLinks = temporaryLinkResults.map((entry) => entry.link);

    return temporaryLinks;
}

class Dropbox_Controller {
    async home(req: Request, res: Response, next: NextFunction) {
        const { token } = req.session;
        if (token) {
            try {
                const paths = await getLinksAsync(token, next);

                if (paths.length > 0) {
                    console.log('paths: ' + paths);

                    res.render('pages/project/project_list', { imgs: paths, projects: {} });
                } else {
                    // if no images, ask user to upload some
                    res.render('empty', { layout: false });
                }
            } catch (error) {
                return next(new Error('Error getting images from Dropbox'));
            }
        } else {
            res.redirect('/login');
        }
    }

    login(req: Request, res: Response) {
        console.log("login what what");

        // create a random state value
        const state = crypto.randomBytes(16).toString('hex');

        // Save state and temporarysession for 10 mins
        // mycache.set(state, "aTempSessionValue", 600);

        mycache.set(state, req.sessionID, 600);

        const dbxRedirect = `${config.DBX_OAUTH_DOMAIN
            + config.DBX_OAUTH_PATH
            }?response_type=code&client_id=${config.DBX_APP_KEY
            }&redirect_uri=${config.OAUTH_REDIRECT_URL
            }&state=${state}`;

        res.redirect(dbxRedirect);
    }

    async oauthredirect(req: Request, res: Response, next: NextFunction) {
        console.log("redirect what what");

        if (req.query.error_description) {
            return next(new Error(req.query.error_description));
        }

        const { state } = req.query;


        // if(!mycache.get(state)){
        if (mycache.get(state) !== req.sessionID) {
            return next(new Error('session expired or invalid state'));
        }

        // Exchange code for token
        if (req.query.code) {
            const options = {
                url: config.DBX_API_DOMAIN + config.DBX_TOKEN_PATH,
                // build query string
                qs: {
                    code: req.query.code,
                    grant_type: 'authorization_code',
                    client_id: config.DBX_APP_KEY,
                    client_secret: config.DBX_APP_SECRET,
                    redirect_uri: config.OAUTH_REDIRECT_URL,
                },
                method: 'POST',
                json: true,
            };

            try {
                const response = await rp(options);

                // we will replace later cache with a proper storage
                // mycache.set("aTempTokenKey", response.access_token, 3600);
                await regenerateSessionAsync(req);
                req.session.token = response.access_token;

                res.redirect('/');
            } catch (error) {
                return next(new Error(`error getting token. ${error.message}`));
            }
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await destroySessionAsync(req);
            res.redirect('/login');
        } catch (error) {
            return next(new Error(`error logging out. ${error.message}`));
        }
    }
}
export default new Dropbox_Controller();

// // steps 1,2,3
// module.exports.home = async (req, res, next) => {
//     const { token } = req.session;
//     if (token) {
//         try {
//             const paths = await getLinksAsync(token);

//             if (paths.length > 0) {
//                 res.render('gallery', { imgs: paths, layout: false });
//             } else {
//                 // if no images, ask user to upload some
//                 res.render('empty', { layout: false });
//             }
//         } catch (error) {
//             return next(new Error('Error getting images from Dropbox'));
//         }
//     } else {
//         res.redirect('/login');
//     }
// };


// // steps 4,5,6
// module.exports.login = (req, res) => {
//     // create a random state value
//     const state = crypto.randomBytes(16).toString('hex');

//     // Save state and temporarysession for 10 mins
//     // mycache.set(state, "aTempSessionValue", 600);

//     mycache.set(state, req.sessionID, 600);

//     const dbxRedirect = `${config.DBX_OAUTH_DOMAIN
//     + config.DBX_OAUTH_PATH
//     }?response_type=code&client_id=${config.DBX_APP_KEY
//     }&redirect_uri=${config.OAUTH_REDIRECT_URL
//     }&state=${state}`;

//     res.redirect(dbxRedirect);
// };


// // steps 8-12
// module.exports.oauthredirect = async (req, res, next) => {
//     if (req.query.error_description) {
//         return next(new Error(req.query.error_description));
//     }

//     const { state } = req.query;


//     // if(!mycache.get(state)){
//     if (mycache.get(state) !== req.sessionID) {
//         return next(new Error('session expired or invalid state'));
//     }

//     // Exchange code for token
//     if (req.query.code) {
//         const options = {
//             url: config.DBX_API_DOMAIN + config.DBX_TOKEN_PATH,
//             // build query string
//             qs: {
//                 code: req.query.code,
//                 grant_type: 'authorization_code',
//                 client_id: config.DBX_APP_KEY,
//                 client_secret: config.DBX_APP_SECRET,
//                 redirect_uri: config.OAUTH_REDIRECT_URL,
//             },
//             method: 'POST',
//             json: true,
//         };

//         try {
//             const response = await rp(options);

//             // we will replace later cache with a proper storage
//             // mycache.set("aTempTokenKey", response.access_token, 3600);
//             await regenerateSessionAsync(req);
//             req.session.token = response.access_token;

//             res.redirect('/');
//         } catch (error) {
//             return next(new Error(`error getting token. ${error.message}`));
//         }
//     }
// };


// module.exports.logout = async (req, res, next) => {
//     try {
//         await destroySessionAsync(req);
//         res.redirect('/login');
//     } catch (error) {
//         return next(new Error(`error logging out. ${error.message}`));
//     }
// };
