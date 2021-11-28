const express = require('express');
const morgan = require('morgan');
const path = require('path');
const env = require(`./environnement/${ process.env.NODE_ENV }`);
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const routes = require('./routes');
const app = express();
app.listen(3000);

exports.app = app;

require('./database');

app.use(cookieParser());
require('./config/jwt.config');
require('./config/globalsRender.config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('short'));

app.use(env.pathRoot, express.static(path.join(__dirname, 'public')), routes);

if (process.env.NODE_ENV === 'dev') {
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        const code = err.code || 500;
        res.status(code).json({
            code : code,
            message: code === 500 ? null : err.message
        });
    });
}

