const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Le nom est obligatoire."]
    },
    images: {
        type: [String]
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    categories: {
        type: [Schema.Types.ObjectId],
        ref: 'category',
        required: [true, "Une catégorie doit être sélectionné."]
    },
    price: {
        type: Number,
        required: [true, "Un prix est obligatoire."],
        min: [0, "Prix minimum 0,00 €."]
    },
    taxe: {
        type: Schema.Types.ObjectId,
        ref: 'taxe',
        required: [true, "Une taxe est obligatoire."]
    },
    totalSales: {
        type: Number
    }
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;