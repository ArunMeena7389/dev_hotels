const express = require("express");
const router = express.Router();
const OrderListData = require("../Schema/OrderListData");
const { jwtAuthMiddleware } = require("../jwt");

// router.post('/create', jwtAuthMiddleware, async (req, res) => {
router.post("/create", async (req, res) => {
  try {
    const data = req.body;

    const newItemOrder = new OrderListData(data);
    const response = await newItemOrder.save();

    if (global._io) {
      global._io.emit("new_order", response);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const businessId = req.headers.business_id;
    console.log(businessId, "-------------businessId");
    const orderResponse = await OrderListData.find({ business_id: businessId });
    res.status(200).json(orderResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
