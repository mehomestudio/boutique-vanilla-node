const router = require('express').Router();
const auth = require('./auth.routes');
const users = require('./users.routes');
const admin = require('./admin.routes');
const { ensureAuthenticated, ensureAdmin } = require("../config/security.config");

router.use('/auth', auth);
router.use('/users', users);
router.use('/admin', ensureAuthenticated, ensureAdmin, admin);

router.get("/", (req, res, next) => {
    res.status(200).render('home.ejs');
});

module.exports = router;