const express = require("express");
const router = express.Router();
const OrderListData = require('../modules/OrderListData');
const { jwtAuthMiddleware } = require('../jwt');

// router.post('/create', jwtAuthMiddleware, async (req, res) => {
    router.post('/create', async (req, res) => {
    try {
      const data = req.body;
    //   data.business_id = req.user.id;
  
      const newItemOrder = new OrderListData(data);
      const response = await newItemOrder.save();
  
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const businessId = req.headers.business_id;
      console.log(businessId,'-------------businessId')
      const orderResponse = await OrderListData.find({ business_id: businessId });
      res.status(200).json(orderResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//   router.put('/:id', jwtAuthMiddleware, async (req, res) => {
//     try {
//       const categoryId = req.params.id;
//       const updatedData = req.body;
  
//       const updatedCategory = await CategoryItem.findByIdAndUpdate(
//         categoryId,
//         updatedData,
//         { new: true, runValidators: true }
//       );
  
//       if (!updatedCategory) {
//         return res.status(404).json({ error: "Category not found" });
//       }
  
//       res.status(200).json(updatedCategory);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });



  module.exports = router;