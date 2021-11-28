const { app } = require('../index');
const env = require(`../environnement/${ process.env.NODE_ENV }`);

const varsLocal = (req, res, next) => {
    global.isAuthenticated = req.isAuthenticated();
    global.user = req.user;
    global.pathRoot = env.pathRoot;
    global.flashes = req.cookies.flashes ?? null;
    if (req.cookies.flashes) {
        res.clearCookie('flashes');
    }
    next();
};

app.use(varsLocal);