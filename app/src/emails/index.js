const env = require(`../environnement/${ process.env.NODE_ENV }`);
const nodemailer = require("nodemailer");
const path = require('path');
const ejs = require('ejs');

class Email {
    transporter;
    from;

    constructor() {
        this.from = env.nodemailer.from;
        this.transporter = nodemailer.createTransport(env.nodemailer.transporter);
    }

    async sendTokenToEmailVerification(options) {
        try {
            const email = {
                from: this.from,
                subject: "[Boutique Vanilla] Vérification de votre email",
                to: options.user.local.email,
                html: await ejs.renderFile(
                    path.join(__dirname, "templates/send-token-to-email-verification.ejs"),
                    {
                        user: options.user,
                        url: `${ env.host }${ env.pathRoot }/users/email-verification/${options.user._id}/${options.user.local.emailToken}`
                    }
                ),
            };
            const response = await this.transporter.sendMail(email);
            console.log(response);
        } catch (e) {
            let errors = {
                errors: []
            };
            errors.errors["email-verification-error"] = {
                message: e.message
            };
            throw errors;
        }
    }

    async sendConfirmationVerifiedEmail(options) {
        try {
            const email = {
                from: this.from,
                subject: "[Boutique Vanilla] Confirmation de votre adresse email",
                to: options.user.local.email,
                html: await ejs.renderFile(
                    path.join(__dirname, "templates/send-confirmation-verified-email.ejs"),
                    {
                        user: options.user
                    }
                ),
            };
            const response = await this.transporter.sendMail(email);
            console.log(response);
        } catch (e) {
            let errors = {
                errors: []
            };
            errors.errors["email-verification-error"] = {
                message: e.message
            };
            throw errors;
        }
    }

    async sendForgotPasswordToken(options) {
        try {
            const email = {
                from: this.from,
                subject: "[Boutique Vanilla] Mot de passe perdu, nouveau mot de passe",
                to: options.user.local.email,
                html: await ejs.renderFile(
                    path.join(__dirname, "templates/send-token-to-forgot-password.ejs"),
                    {
                        user: options.user,
                        url: `${ env.host }${ env.pathRoot }/users/forgot-password/${options.user._id}/${options.user.local.passwordToken}`
                    }
                ),
            };
            const response = await this.transporter.sendMail(email);
            console.log(response);
        } catch (e) {
            let errors = {
                errors: []
            };
            errors.errors["email-forgot-password-token"] = {
                message: e.message
            };

            throw errors;
        }
    }

    async sendConfirmationUpdatePassword(options) {
        try {
            const email = {
                from: this.from,
                subject: "[Boutique Vanilla] Modification de votre mot de passe avec succès.",
                to: options.user.local.email,
                html: await ejs.renderFile(
                    path.join(__dirname, "templates/send-confirmation-new-password.ejs"),
                    {
                        user: options.user
                    }
                )
            };
            const response = await this.transporter.sendMail(email);
            console.log(response);
        } catch (e) {
            let errors = {
                errors: []
            };
            errors.errors["email-confirmation-update-password"] = {
                message: e.message
            };

            throw errors;
        }
    }
}

module.exports = new Email();