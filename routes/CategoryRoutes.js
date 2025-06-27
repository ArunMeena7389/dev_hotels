const express = require("express");
const router = express.Router();
const CategoryItem = require('../modules/CategoryItem');
const { jwtAuthMiddleware } = require('../jwt');

router.post('/create', jwtAuthMiddleware, async (req, res) => {
    try {
      const data = req.body;
  
      data.business_id = req.user.id;
  
      const newItemMenu = new CategoryItem(data);
      const response = await newItemMenu.save();
  
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
      const businessId = req.user.id;
  
      const categories = await CategoryItem.find({ business_id: businessId });
  
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.put('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
      const categoryId = req.params.id;
      const updatedData = req.body;
  
      const updatedCategory = await CategoryItem.findByIdAndUpdate(
        categoryId,
        updatedData,
        { new: true, runValidators: true }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
  
      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
      const categoryId = req.params.id;
  
      const deletedCategory = await CategoryItem.findByIdAndDelete(categoryId);
  
      if (!deletedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
  
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  module.exports = router;