const moment = require('moment');
const uuid = require('uuid');
const { createUser, findUserById, findUserByEmail, findUserByUsername} = require('../queries/user.queries');
const env = require('../environnement/dev');
const emailFactory = require('../emails');
const User = require('../database/models/user.model');

exports.signupForm = (req, res, next) => {
    res.render('auth/signup.ejs', { errors: null, body: null });
};

exports.signup = async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        await emailFactory.sendTokenToEmailVerification({
            user,
        });
        res.redirect(`${ env.pathRoot }/auth/signin/connexion`);
    } catch (e) {
        let errors = [];
        if (e.name === "MongoServerError" && e.code === 11000) {
            errors[0] = "Cette email existe déjà.";
        }
        else if (e instanceof Object) {
            errors = Object.keys(e.errors).map( key => e.errors[key].message );
        } else {
            errors[0] = e;
        }
        res.render('auth/signup.ejs', { errors, body: req.body })
    }
};

exports.emailVerification = async (req, res, next) => {
    try {
        const { userId, token } = req.params;
        const user = await findUserById(userId);

        if (user && !user.local.emailVerified) {
            const now = moment();
            const tokenExp = moment(user.local.emailTokenExpiration);

            if (user.local.emailToken === token && tokenExp > now) {
                user.local.emailToken = null;
                user.local.emailTokenExpiration = null;
                user.local.emailVerified = true;
                user.local.roles.push("ROLE_MEMBER");

                await user.save();

                await emailFactory.sendConfirmationVerifiedEmail({
                    user: user
                });

                res.cookie('flashes', [{
                    type: "success",
                    message: "Votre email a été vérifiée avec succès."
                }]);

            } else {
                const newTokenExp = moment()
                    .add(2, 'hours')
                    .toDate();

                user.local.emailToken = uuid.v4();
                user.local.emailTokenExpiration = newTokenExp;
                await user.save();

                await emailFactory.sendTokenToEmailVerification({
                    user: user
                });

                res.cookie('flashes', [{
                    type: "danger",
                    message: "Le lien n'est plus valide. Un email vous sera envoyé avec un nouveau lien valide pour une durée de 2 heures."
                }]);
            }
            res.redirect(env.pathRoot);
        } else {
            res.status(404).send();
        }
    } catch (e) {
        next(e);
    }
};

exports.forgotPasswordForm = (req, res, next) => {
    res.render('users/forgot-password-form.ejs', { body: null });
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await findUserByEmail(email);

        if (user) {
            const now = moment();
            const tokenExp = moment(user.local.passwordTokenExpiration);

            if ((!user.local.passwordToken && !user.local.passwordTokenExpiration) || now > tokenExp) {
                user.local.passwordToken = uuid.v4();
                user.local.passwordTokenExpiration = moment()
                    .add(2, "hours")
                    .toDate();
                await user.save();
            }

            res.cookie('flashes', [{
                type: 'success',
                message: "Un email contenant un lien pour modifier votre mot de passe vient de vous être envoyé."
            }]);

            await emailFactory.sendForgotPasswordToken({
                user: user
            });

            res.redirect(`${env.pathRoot}/users/forgot-password`);
        } else {
            const flash = [{
                type: "danger",
                message: "L'email n'existe pas, veuillez réessayer une nouvelle adresse email."
            }];
            res.render(`users/forgot-password-form.ejs`, { flashes: flash, body: req.body });
        }
    } catch (e) {
        next(e);
    }
};

exports.forgotPasswordNewPasswordForm = async (req, res, next) => {
    try {
        const { userId, token } = req.params;
        const user = await findUserById(userId);
        if (user && user.local.passwordToken === token) {
            const now = moment();
            const tokenExp = moment(user.local.passwordTokenExpiration);
            if (now < tokenExp) {
                res.render('users/forgot-password-new-password-form.ejs', { userId, token });
            } else {
                user.local.passwordToken = uuid.v4();
                user.local.passwordTokenExpiration = moment()
                    .add(2, "hours")
                    .toDate();
                await user.save();

                await emailFactory.sendForgotPasswordToken({
                    user: user
                });

                res.cookie('flashes', [{
                    type: "danger",
                    message: "Le lien a expiré, vous allez recevoir un nouveau lien par email."
                }]);
                res.redirect(`${env.pathRoot}/users/forgot-password`);
            }
        } else {
            res.cookie('flashes', [{
                type: "danger",
                message: "Le lien est invalide, veuillez refaire à nouveau la procédure de récupérer du mot de passe."
            }]);

            res.redirect(`${env.pathRoot}/users/forgot-password`);
        }
    } catch (e) {
        next(e);
    }
};

exports.forgotPasswordNewPassword = async (req, res, next) => {
    try {
        const { userId, token } = req.params;
        const user = await findUserById(userId);

        if (user && user.local.passwordToken === token) {
            const now = moment();
            const tokenExp = moment(user.local.passwordTokenExpiration);

            if (now < tokenExp) {
                const { password, passwordConfirm } = req.body;
                let errors = [];
                let verif = false;

                if (password !== passwordConfirm) {
                    errors.push({
                        type: "danger",
                        message: "Les mots de passe ne sont pas identiques."
                    });
                    verif = true;
                }

                if (password.length < 4 || password.length > 16) {
                    errors.push({
                        type: "danger",
                        message: "Le mot de passe doit contenir entre 4 et 16 caractères."
                    });
                    verif = true;
                }

                if (verif) {
                    res.render("users/forgot-password-new-password-form.ejs", { flashes: errors, userId, token });
                } else {
                    user.local.password = await User.hashPassword(password);
                    user.local.passwordToken = null;
                    user.local.passwordTokenExpiration = null;
                    await user.save();

                    res.cookie("flashes", [{
                        type: "success",
                        message: "Votre mot de passe a bien été enregistré, vous pouvez dès à présent vous connecter avec celui-ci."
                    }]);

                    await emailFactory.sendConfirmationUpdatePassword({ user: user });

                    res.redirect(`${env.pathRoot}/auth/signin/connexion`);
                }
            } else {
                user.local.passwordToken = uuid.v4();
                user.local.passwordTokenExpiration = moment()
                    .add(2, "hours")
                    .toDate();
                await user.save();

                await emailFactory.sendForgotPasswordToken({
                    user: user
                });

                res.cookie('flashes', [{
                    type: "danger",
                    message: "Le lien a expiré, vous allez recevoir un nouveau lien par email."
                }]);
                res.redirect(`${env.pathRoot}/users/forgot-password`);
            }
        } else {
            res.cookie('flashes', [{
                type: "danger",
                message: "Le lien est invalide, veuillez refaire à nouveau la procédure de récupérer du mot de passe."
            }]);

            res.redirect(`${env.pathRoot}/users/forgot-password`);
        }
    } catch (e) {
        next(e);
    }
};

exports.resetPasswordForm = (req, res, next) => {
    res.render("users/reset-password-form");
};

exports.resetPassword = async (req, res, next) => {
    try {
        const user = req.user;

        if (user) {
            const { oldPassword, password, passwordConfirm } = req.body;
            const match = await user.comparePassword(oldPassword);
            let errors = [];
            if (match) {
                let verif = false;

                if (password !== passwordConfirm) {
                    errors.push({
                        type: "danger",
                        message: "Les mots de passe ne sont pas identiques."
                    });
                    verif = true;
                }

                if (password.length < 4 || password.length > 16) {
                    errors.push({
                        type: "danger",
                        message: "Le mot de passe doit contenir entre 4 et 16 caractères."
                    });
                    verif = true;
                }

                if (verif) {
                    res.render("users/reset-password-form.ejs", { flashes: errors });
                } else {
                    user.local.password = await User.hashPassword(password);
                    await user.save();

                    res.cookie("flashes", [{
                        type: "success",
                        message: "Votre mot de passe a bien été modifié."
                    }]);

                    await emailFactory.sendConfirmationUpdatePassword({user: user});

                    res.redirect(`${env.pathRoot}/auth/signin/connexion`);
                }
            } else {
                errors.push({
                    type: "danger",
                    message: "Le mot de passe actuel est incorrect."
                });
                res.render("users/reset-password-form.ejs", { flashes: errors });
            }
        }
    } catch (e) {
        next(e);
    }
};