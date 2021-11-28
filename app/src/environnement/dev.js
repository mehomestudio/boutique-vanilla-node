module.exports = {
    dbUrl: `mongodb://db/boutique`,
    pathRoot: '/boutique-vanilla',
    host: 'http://localhost',
    nodemailer: {
        from: "MH-DevApp <no-reply@mh-devapp.ovh>",
        transporter: {
            host: "mailhog",
            port: 1025
        }
    }
}