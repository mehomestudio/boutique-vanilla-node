const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carrierSchema = new Schema({
    name: {
        type: String,
        required: [true, "Le nom est obligatoire."]
    },
    logoImg: {
        type: String,
        default: "/images/carrier-default.png"
    },
    description: {
        type: String,
        required: [true, "Une description est obligatoire."]
    },
    price: {
        type: Number,
        min: [0, "Le montant est minimum est 0,00 €."],
        default: 0
    },
    taxe: {
        type: Schema.Types.ObjectId,
        ref: 'taxe',
        required: [true, "Aucune taxe n'a été sélectionné."]
    }
});

const Carrier = mongoose.model('carrier', carrierSchema);

module.exports = Carrier;