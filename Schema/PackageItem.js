const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  packageName: { type: String, required: true },
  items: [{ type: String }],
  discount: { type: Number, default: 0 },
  image_url: {
    type: String,
  },
  price: { type: String },
  business_id:{ type: String },
});

module.exports = mongoose.model("Package", packageSchema);
