const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    name: {
        type: String,
        required: [true, "Le nom de l'adresse est obligatoire."]
    },
    street: {
        type: String,
        required: [true, "La rue est obligatoire."]
    },
    numberStreet: {
        type: String
    },
    additionalInfos: {
        type: String
    },
    city: {
        type: String,
        required: [true, "La ville est obligatoire."]
    },
    zipCode: {
        type: String,
        required: [true, "Le code postal est obligatoire."]
    }
});

const Address = mongoose.model('address', addressSchema);

module.exports = Address;