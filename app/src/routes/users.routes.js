const router = require('express').Router();
const {
    ensureAnonymous,
    ensureAuthenticated,
    isUserOwner
} = require('../config/security.config');
const {
    signupForm,
    signup,
    emailVerification,
    forgotPasswordForm,
    forgotPassword,
    forgotPasswordNewPasswordForm,
    forgotPasswordNewPassword,
    resetPasswordForm,
    resetPassword
} = require('../controllers/users.controller');

router.get('/signup/inscription', ensureAnonymous, signupForm);
router.post('/signup/inscription', ensureAnonymous, signup);
router.get('/email-verification/:userId/:token', emailVerification);
router.get('/forgot-password', ensureAnonymous, forgotPasswordForm);
router.post('/forgot-password', ensureAnonymous, forgotPassword);
router.get('/forgot-password/:userId/:token', ensureAnonymous, forgotPasswordNewPasswordForm);
router.post('/forgot-password/:userId/:token', ensureAnonymous, forgotPasswordNewPassword);
router.get('/reset-password', ensureAuthenticated, resetPasswordForm);
router.post('/reset-password', ensureAuthenticated, resetPassword);

module.exports = router;