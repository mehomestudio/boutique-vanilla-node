const mongoose = require('mongoose');
const env = require(`../environnement/${ process.env.NODE_ENV}`);

mongoose.connect(env.dbUrl)
    .then(() => console.log('Connected on Db: OK'))
    .catch(err => console.log(err));