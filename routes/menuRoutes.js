const express = require("express")
const router = express.Router();

const MenuItem = require('../modules/MenuItem');
const { jwtAuthMiddleware } = require('./../jwt');

router.post('/create', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = req.body //the request body contains person data

        //create a new person document using the mongose model
        const newItemMenu = new MenuItem(data);
        const response = await newItemMenu.save();
        res.status(200).json(response);


    } catch (error) {
        console.log(error, 'error api person');
        res.status(500).json({ error: "Internal server error" })


    }
})

router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await MenuItem.find();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server error' })
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

router.put('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const menuId = req.params.id; // get id by url
        const updatedMenuData = req.body;
        const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
            new: true, // update date
            runValidators: true //mongos validation
        })
        if (!response) {
            res.status(404).json({ error: "Person not found" })
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const menuId = req.params.id; // get id by url

        const response = await MenuItem.findByIdAndDelete(menuId)
        res.status(200).json({ message: "Item has deleted" })
        if (!response) {
            res.status(404).json({ error: "Person not found" })
        }

    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }


})

module.exports = router;
