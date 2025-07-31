const express = require("express")
const router = express.Router();
const Customer = require('../Schema/Customer')

router.post('/add-find', async (req, res) => {
    const { name, mobile } = req.body;
  
    if (!name || !mobile)
      return res.status(400).json({ error: 'All fields are required' });
  
    try {
      // Check if customer already exists
      const existingCustomer = await Customer.findOne({ mobile });
  
      if (existingCustomer) {
        return res.status(200).json({
          message: 'Customer already exists',
          customer: existingCustomer
        });
      }
  
      // Create new customer
      const newCustomer = new Customer({ name, mobile });
      const savedCustomer = await newCustomer.save();
  
      return res.status(201).json({
        message: 'Customer created successfully',
        customer: savedCustomer
      });
  
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/', async (req, res) => {
      try {
          const data = await Customer.find();
          res.status(200).json(data);
  
      } catch (error) {
          res.status(500).json({ error: 'Internal Server error' })
      }
  
  });

  module.exports = router;