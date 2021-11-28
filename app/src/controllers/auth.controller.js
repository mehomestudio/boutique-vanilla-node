const env = require('../environnement/dev');
const { findUserByEmail } = require('../queries/user.queries');

exports.signinForm = (req, res, next) => {
    res.render('auth/signin', { errors: null, body: null });
};

exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        let errors = [];
        if  (user && user.active) {
            const match = await user.comparePassword(password);
            if (match) {
                req.login(user);
                res.redirect(env.pathRoot);
            } else {
                errors[0] = "Email ou mot de passe incorrect.";
                res.render('auth/signin', { errors, body: req.body });
            }
        } else {
            errors[0] = "Email ou mot de passe incorrect.";
            res.render('auth/signin', { errors, body: req.body });
        }
    } catch (e) {
        next(e);
    }
};

exports.signout = (req, res, next) => {
    req.logout();
    res.redirect(env.pathRoot);
}