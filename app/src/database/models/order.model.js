const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    numOrder: {
        type: String
    },
    products: [{
        id: {
            type: String
        },
        name: {
            type: String
        },
        image: {
            type: String
        },
        price: {
            type: Number
        },
        taxe: {
            type: Schema.Types.ObjectId,
            ref: 'taxe'
        },
        qty: {
            type: Number,
            min: [1, "La quantité minimum est de 1."]
        }
    }],
    carrier: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        logoImg: {
            type: String
        },
        price: {
            type: Number
        },
        taxe: {
            type: Schema.Types.ObjectId,
            ref: 'taxe'
        }
    },
    addressInvoice: {
        id: {
            type: String
        },
        street: {
            type: String
        },
        numberStreet: {
            type: String
        },
        additionalInfos: {
            type: String
        },
        city: {
            type: String
        },
        zipCode: {
            type: String
        }
    },
    addressDelivery: {
        id: {
            type: String
        },
        street: {
            type: String
        },
        numberStreet: {
            type: String
        },
        additionalInfos: {
            type: String
        },
        city: {
            type: String
        },
        zipCode: {
            type: String
        }
    },
    totalPrice: {
        type: Number
    },
    totalTaxes: {
        type: Number
    },
    dataOrder: {
        type: Date,
        immutable: true
    },
    dataDone: {
        type: Date,
        immutable: true
    },
    status: {
        type: Number
    }
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;