const mongoose = require("mongoose");

const OrderListSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  business_id: { type: String, required: true },
  customer_id: { type: String, required: true },
  business_name: { type: String },
  customer_name: { type: String, required: true },
  order_item: { type: Array },
  total_price: { type: Number, required: true },
  order_status: { type: String },
  payment_status: { type: String },
  order_time: { type: String },
  order_accept: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24, // 24 hours (in seconds)
  },
});

// ✅ Pre-save hook to auto-generate if not provided
OrderListSchema.pre("save", async function (next) {
  if (!this.order_id) {
    this.order_id = Math.floor(100000 + Math.random() * 900000).toString();
  }
  next();
});

const OrderListData = mongoose.model("OrderListData", OrderListSchema);
module.exports = OrderListData;
