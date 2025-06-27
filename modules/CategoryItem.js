const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    is_remove: {
        type: Boolean,
    }
});

const CategoryItem = mongoose.model('CategoryItem', CategorySchema);
module.exports = CategoryItem;