const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    orderIndex: {
        type: Number
    },
    CategoryParent: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    }
});

const Category = mongoose.model('category', categorySchema);

module.exports = Category;