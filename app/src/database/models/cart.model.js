const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product'
        },
        qty: {
            type: Number,
            min: [1, "La quantité minimum est de 1."]
        }
    }]
}, { timestamps: true });

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;