const multer = require("multer");
const express = require("express")
const router = express.Router();
const fs = require("fs");

const MenuItem = require('../modules/MenuItem');
const { jwtAuthMiddleware } = require('./../jwt');
const path = require("path");
const { menueField } = require("../Field");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "" + Math.floor(Math.random() * 1000000) + '.png')
    }
})

// Initialize multer with the storage configuration
var upload = multer({ storage });
var typeUpload = upload.single('image');

router.post('/create', jwtAuthMiddleware, typeUpload, async (req, res) => {
    try {
        const data = req.body //the request body contains person data
        const { filename } = req.file || {};
        if (filename) data.image_url = filename;

        const newItemMenu = new MenuItem(data);
        const response = await newItemMenu.save();
        res.status(200).json(response);


    } catch (error) {
        res.status(500).json({ error: "Internal server error" })


    }
})

// get menu item by field
// {
//     "fields": ["name", "price", "image_url","taste","description"],
//     "filter": {
//       "taste": ["sweet", "spicy"]
//     }
//   }
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const { fields, filter } = req.body;
        if (!fields || !Array.isArray(fields) || fields.length === 0) {
            return res.status(200).json([]);
        }

        const allowedFields = menueField;
        const filteredFields = fields.filter(field => allowedFields.includes(field));
        const selectFields = filteredFields.join(' ');

        const query = {};
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
        const { filename } = req.file || "";
        if (filename && !updatedMenuData.image) updatedMenuData.image_url = filename;
        const responseImage = await MenuItem.findById(menuId);
        const imagePath = path.join(__dirname, "../uploads", responseImage.image_url);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
            new: true,
            runValidators: true
        })
        if (!response) {
            res.status(404).json({ error: "Person not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const menuId = req.params.id;
        const response = await MenuItem.findByIdAndDelete(menuId);
        const imagePath = path.join(__dirname, "../uploads", response.image_url);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

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

module.exports = router;
