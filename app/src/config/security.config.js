const env = require(`../environnement/${ process.env.NODE_ENV }`);
const { findUserByUsername, findUserById} = require('../queries/user.queries');

exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.cookie('flashes', [{
            type: "danger",
            message: "Vous devez être authentifié pour accéder à la page."
        }]);
        res.status(403).redirect(`${ env.pathRoot }/auth/signin/connexion`);
    }
};

exports.ensureAnonymous = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.cookie('flashes', [{
            type: "danger",
            message: "La page n'est pas accessible."
        }]);
        res.status(403).redirect(`${ env.pathRoot }`);
    }
};

exports.ensureAdmin = async (req, res, next) => {
    const user = await findUserById(req.user._id);
    if (user && user.local.roles.includes("ROLE_ADMIN")) {
        next();
    } else {
        res.status(404).end();
    }
};