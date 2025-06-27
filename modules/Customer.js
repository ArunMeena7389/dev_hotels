const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    orderHistory:{
        type:Array,
        default:[]
    }
});

const CustomerInfo = mongoose.model('CustomerInfo', CustomerSchema);
module.exports = CustomerInfo;