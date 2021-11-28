const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
        default: "/images/profil-default.png"
    },
    active: {
        type: Boolean,
        default: true
    },
    local: {
        email: {
            type: String,
            required: [true, "L'adresse email est obligatoire."],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Le mot de passe est obligatoire."]
        },
        firstname: {
            type: String,
            required: [true, "Le prénom est obligatoire."]
        },
        lastname: {
            type: String,
            required: [true, "Le nom est obligatoire."]
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        emailToken: {
            type: String
        },
        emailTokenExpiration: {
            type: Date
        },
        passwordToken: {
            type: String
        },
        passwordTokenExpiration: {
            type: Date
        },
        roles: [String],
        addresses: {
            type: [Schema.Types.ObjectId],
            ref: "address"
        }
    }
}, { timestamps: true });

// Static : Hash password
userSchema.statics.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12);
        return bcrypt.hash(password, salt);
    } catch (e) {
        throw e;
    }
};

// Method : Compare password
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model('user', userSchema);

module.exports = User;