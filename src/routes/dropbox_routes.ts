import { Router, Request, Response } from 'express';
const router: Router = Router();

const controller = require('../controllers/dropbox/dropbox_controller');

/* GET home page. */
router.get('/home', controller.default.home);

router.get('/login', controller.default.login);

router.get('/logout', controller.default.logout);

router.get('/oauthredirect', controller.default.oauthredirect);

// module.exports = router;
export default router;
