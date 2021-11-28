const secret = process.env.JwtToken;
const env = require(`../environnement/${ process.env.NODE_ENV }`);
const jwt = require('jsonwebtoken');
const { app } = require('../index');
const { findUserById } = require('../queries/user.queries');

const createJwtToken = ({ user = null, id = null }) => {
    const jwtToken = jwt.sign({
        sub: id || user._id.toString(),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 5)
    }, secret);
    return jwtToken;
};

exports.createJwtToken = createJwtToken;

const checkExpirationToken = (token, res) => {
    const tokenExp = token.exp;
    const nowInSec = Math.floor(Date.now() / 1000);

    if (nowInSec <= tokenExp) {
        return token;
    } else if ((nowInSec - tokenExp) < 60 * 60 * 24) {
        const refreshedToken = createJwtToken({ id: token.sub });
        res.cookie('jwt', refreshedToken);
        return jwt.verify(refreshedToken, secret);
    } else {
        throw new Error('Le token d\'authentification a expiré.');
    }
}

const extractUserFromToken = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
            decodedToken = checkExpirationToken(decodedToken, res);
            const user = await findUserById(decodedToken.sub);
            if (user && user.active) {
                req.user = user;
                next();
            } else {
                res.clearCookie('jwt');
                res.redirect(env.pathRoot);
            }
        } catch (e) {
            res.clearCookie('jwt');
            res.redirect(env.pathRoot);
        }
    } else {
        next();
    }
};

const addJwtFeatures = async (req, res, next) => {
    req.isAuthenticated = () => !!req.user;
    req.logout = () => res.clearCookie('jwt');
    req.login = (user) => {
        const token = createJwtToken({ user });
        res.cookie('jwt', token);
    };
    next();
};

app.use(extractUserFromToken);
app.use(addJwtFeatures);
