const mongoose = require("mongoose");


const ImageSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    filename:{
        type: String,
        required:true
    }
});

const ImageModel = mongoose.model('images',ImageSchema);

module.exports = ImageModel;