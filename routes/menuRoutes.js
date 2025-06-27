const express = require("express")
const router = express.Router();
const uploads = require('../Config/multer');

const MenuItem = require('../modules/MenuItem');
const { jwtAuthMiddleware } = require('./../jwt');
const { menueField } = require("../Field");

// Initialize multer with the storage configuration
var typeUpload = uploads.single('image');

router.post('/create', jwtAuthMiddleware, typeUpload, async (req, res) => {
    try {
      const data = req.body;
  
      if (req.file && req.file.path) {
        data.image_url = req.file.path;
      }
  
      data.business_id = req.user.id;
  
      const newItemMenu = new MenuItem(data);
      const response = await newItemMenu.save();
  
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const { fields, filter } = req.body;
        if (!fields || !Array.isArray(fields) || fields.length === 0) {
            return res.status(200).json([]);
        }

        const allowedFields = menueField;
        const filteredFields = fields.filter(field => allowedFields.includes(field));
        const selectFields = filteredFields.join(' ');

        const query = { business_id: req.user.id };

        if (filter && typeof filter === 'object') {
            Object.keys(filter).forEach(key => {
                if (allowedFields.includes(key)) {
                    const value = filter[key];
                    if (Array.isArray(value)) {
                        query[key] = { $in: value };
                    } else {
                        query[key] = value;
                    }
                }
            });
        }
        const data = await MenuItem.find(query).select(selectFields);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/taste/:type', jwtAuthMiddleware, async (req, res) => {
    const tasteType = req.params.type;
    try {
        if (tasteType == "sweet" || tasteType == "spicy" || tasteType == "sour") {
            const data = await MenuItem.find({ taste: tasteType });
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Internal Server error' })

        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Server error' })
    }

});
router.put('/:id', jwtAuthMiddleware, typeUpload, async (req, res) => {
    try {
      const menuId = req.params.id;
      const updatedMenuData = req.body;  
      if (req.file && req.file.path) {
        updatedMenuData.image_url = req.file.path; 
      }
  
      const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
        new: true,
        runValidators: true,
      });
  
      if (!response) {
        return res.status(404).json({ error: "Menu item not found" });
      }
  
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const menuId = req.params.id;
        const response = await MenuItem.findByIdAndDelete(menuId);

        if (!response) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: "Item has been deleted successfully" });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid item ID format" });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/data', async (req, res) => {
    try {
      const businessId = req.headers.business_id;
  
      if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }
  
      const data = await MenuItem.find({ business_id: businessId });
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
