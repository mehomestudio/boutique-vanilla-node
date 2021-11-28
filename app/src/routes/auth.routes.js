const router = require('express').Router();
const { ensureAnonymous, ensureAuthenticated } = require('../config/security.config');
const { signin, signinForm, signout } = require('../controllers/auth.controller');

router.get('/signin/connexion', ensureAnonymous, signinForm);
router.post('/signin/connexion', ensureAnonymous, signin);
router.get('/signout', ensureAuthenticated, signout);

module.exports = router;