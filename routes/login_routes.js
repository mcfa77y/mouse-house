const express = require('express');

const router = express.Router();
const BlueBird = require('bluebird');
const isFalsey = require('falsey');
const passport = require('passport');
const breed_controller = require('../controllers/breed_controller');
const {
    reshape_for_select,
    select_json,
    log_json,
    getErrorGif
} = require('./utils_routes');
const {
    get_breed_inputs,
    create_model
} = require('./utils_breed_routes');

// login page
router.get('/', (req, res) => {
    res.render('pages/login/login', {
        extra_js: ['breed_list.bundle.js'],
    });


});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback', 
  passport.authenticate('google', { successRedirect : '/mouse',
  failureRedirect : '/login',
  failureFlash : true
}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
router.get('/create', (req, res) => {
    BlueBird.props({
            input: get_breed_inputs(),
        })
        .then(({
            input: {
                genotype,
                male_mice,
                female_mice,
                mice,
            },
        }) => {
            const gt = select_json(genotype);
            const mm = select_json(male_mice, reshape_for_select);
            const fm = select_json(female_mice, reshape_for_select);

            res.render('pages/breed/breed_create', {
                genotype: gt,
                male_mice: mm,
                mice,
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
        .then(({
            input,
            breed
        }) => {
            log_json(breed);
            const genotype = select_json(input.genotype);
            const male_mice = select_json(input.male_mice, reshape_for_select);
            const female_mice = select_json(input.female_mice, reshape_for_select);
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
            res.status(500).send({
                success: false,
                err
            });
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
            res.send({
                success: true
            });
        })
        .catch((err) => {
            res.status(500).send({
                success: false,
                err
            });
        });
});

module.exports = router;