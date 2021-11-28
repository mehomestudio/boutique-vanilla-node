const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxeSchema = new Schema({
    code: {
        type: String,
        required: [true, "Le code est obligatoire."],
        unique: [true, "Le code est unique."]
    },
    pourcent: {
        type: Number,
        min: [1, "Le pourcentage minimum est de 1."],
        max: [100, "Le pourcentage maximum est de 100."],
        required: [true, "Le pourcentage est obligatoire."]
    }
});

const Taxe = mongoose.model('taxe', taxeSchema);

module.exports = Taxe;