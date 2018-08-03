const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const isFalsey = require('falsey');
const Axios = require ('axios');

const breed_controller = require('../controllers/breed_controller');
const { select_json, log_json, getErrorGif } = require('./utils_routes');
const { get_breed_inputs, create_model } = require('./utils_breed_routes');

const client_id = '491afd8690be4d8cb71e311407826ad5';
const client_secret = 'c45753b01e014562bc0cd0db0ca3c1c4';
const redirect_uri = 'http://localhost:5000/festival/login/callback';
const base64_id_secret = new Buffer(`${client_id}:${client_secret}`).toString('base64')
router.get('/', (req, res) => {
            res.render('pages/festival/festival_index', {
                extra_js: ['festival_index.bundle.js'],
            });
});


router.get('/login/callback', async (req, res) => {
    const code = req.query.code 
    const grant_type = "authorization_code";
    
    const token_uri = 'https://accounts.spotify.com/api/token';

    const header = `Authorization: Basic ${base64_id_secret}`;
    const data = {
        code,
        grant_type,
        redirect_uri,
        client_id,
        client_secret
    }
    const config = {
        url: token_uri,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: data,
        method: "post",
    }

    const dat = await Axios(config).then((res)=>{
        //log_json(res.data);
        return res.data;
        // res.render('pages/festival/festival_index', {
        //     extra_js: ['festival_index.bundle.js'],
        // });
    })
    .catch((err)=>{
        log_json(err.response.data);
         res.render('pages/festival/festival_index', {
             extra_js: ['festival_index.bundle.js'],
         });
    });

    const config2 = {
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
            Authorization: 'Bearer ' + dat.access_token
        }
    }
    Axios(config2).then((res) => {
        log_json(res.data);
    })
    .catch((err)=>{
        log_json(err.response.data);
         res.render('pages/festival/festival_index', {
             extra_js: ['festival_index.bundle.js'],
         });
    });
   
});

router.get('/login', (req, res) => {
    
    
    
    
    const scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + client_id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

router.get('/accessToken/callback', (req, res) => {
    console.log(req.query)
    res.render('pages/festival/festival_index', {
        extra_js: ['festival_index.bundle.js'],
    });
});

router.post('/accessToken', (req, res) => {
    const code = req.body.code;
    const client_id = '491afd8690be4d8cb71e311407826ad5';
    const client_secret = 'c45753b01e014562bc0cd0db0ca3c1c4';
    var redirect_uri = 'http://localhost:5000/festival/accessToken/callback';
    
    
});

router.get('/create', (req, res) => {
    BlueBird.props({
        input: get_breed_inputs(),
    })
        .then(({ input: { genotype, male_mice, female_mice } }) => {
            const gt = select_json(genotype, 'mouse_genotype', 'Genotype');
            const mm = select_json(male_mice, 'male_mouse');
            const fm = select_json(female_mice, 'female_mouse');

            res.render('pages/breed/breed_create', {
                genotype: gt,
                male_mice: mm,
                female_mice: fm,
                extra_js: ['breed_create.bundle.js'],
            });
        })
        .catch((error) => {
            getErrorGif().then((errorImageUrl) => {
                res.render('error', {
                    error,
                    errorImageUrl,
                });
            });
        });
});

router.get('/:id_alias', (req, res) => {
    BlueBird.props({
        input: get_breed_inputs(),
        breed: breed_controller.by_id_alias(req.params.id_alias),
    })
        .then(({ input, breed }) => {
            const genotype = select_json(input.genotype, 'mouse_genotype', 'Genotype');
            const male_mice = select_json(input.male_mice, 'male_mouse');
            const female_mice = select_json(input.female_mice, 'female_mouse');
            log_json(breed);

            res.render('pages/breed/breed_update', {
                genotype,
                male_mice,
                female_mice,
                breed,
                extra_js: ['breed_update.bundle.js'],
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ success: false, err });
        });
});

router.delete('/:id', (req, res) => {
    const rm_ids = isFalsey(req.query.id_alias) ? req.params.id : req.params.id_alias;

    const rm_promises = rm_ids.split(',').map(id => breed_controller.delete(id));

    return Promise.all(rm_promises)
        .then(() => {
            res.send({
                success: true,
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err,
            });
        });
});

router.put('/', (req, res) => {
    const model = create_model(req.body);
    breed_controller.insert(model)
        .then(() => {
            res.send({
                success: true,
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err,
            });
        });
});

// update
router.post('/', (req, res) => {
    const model = create_model(req.body);
    breed_controller.update(model)
        .then(() => {
            res.send({ success: true });
        })
        .catch((err) => {
            res.status(500).send({ success: false, err });
        });
});

module.exports = router;
