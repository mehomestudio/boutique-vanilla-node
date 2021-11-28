const { User } = require('../database/models');
const uuid = require('uuid');
const moment = require('moment');

exports.findUserById = (userId) => {
    return User.findOne({ _id: userId }).exec();
}

exports.findUserByEmail = (email) => {
    return User.findOne({ 'local.email': email }).exec();
}

exports.findUserByUsername = (username) => {
    return User.findOne({ username: username }).exec();
}

exports.findUsersAll = () => {
    return User.find({}).sort({ createdAt: "ASC" }).exec();
}

exports.createUser = async (user) => {
    try {
        let hasErrors = false;
        const errors = {
            "errors": []
        };

        if (user.firstname.length < 1) {
            errors.errors["firstname-short"] = {
                message: "Le prénom doit contenir au minimum 1 caractère."
            }
            hasErrors = true;
        }

        if (user.lastname.length < 1) {
            errors.errors["lastname-short"] = {
                message: "Le nom doit contenir au minimum 1 caractère."
            }
            hasErrors = true;
        }

        if (user.password !== user.passwordConfirm) {
            errors.errors["password-different"] = {
                message: "Les mots de passe doivent être identiques."
            }
            hasErrors = true;
        }

        if (user.password.length < 4 || user.password.length > 16) {
            errors.errors["password-length"] = {
                message: "Le mot de passe doit contenir entre 4 et 16 caractères."
            }
            hasErrors = true;
        }

        if (hasErrors) {
            throw errors;
        }

        let username = user.email.split('@')[0];
        User.count({ username: username }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result > 0) {
                    username += '#'+result;
                }
            }
        });

        const hashPassword = await User.hashPassword(user.password);
        return new User({
            username,
            local: {
                ...user,
                password: hashPassword,
                emailToken: uuid.v4(),
                emailTokenExpiration: moment()
                    .add(2, 'hours')
                    .toDate(),
                roles: ["ROLE_USER"]
            }
        }).save();

    } catch (e) {
        throw e;
    }
};