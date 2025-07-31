const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    taste: {
        type: String,
        enum: ['sweet', 'spicy', 'sour'],
        required: true
    },
    price: {
        type: String,
        required: true
    },
    is_drink: {
        type: Boolean,
        default: false
    },
    num_sales: {
        type: Number,
        default: 0
    },
    image_url: {
        type: String
    },
    description: {
        type: String
    },
    type_diss: {
        type: String
    },
    business_id:{
        type: String
    }
});

const MenuItem = mongoose.model('MenuItem', MenuSchema);

module.exports = MenuItem;