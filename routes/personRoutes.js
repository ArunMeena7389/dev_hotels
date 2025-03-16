const express = require("express")
const router = express.Router();
const bcrypt = require('bcrypt');

const Person = require('../modules/person')
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const { isEmailValid } = require("../Hellps/content");

// POST route to add a person
router.post('/register', async (req, res) => {
    const { name, email, work, mobile, password } = req.body;
    try {
        if (!name || !email || !work || !mobile || !password)
            return res.status(401).json({ error: 'All * field required.' });


        if (!isEmailValid(email))
            return res.status(401).json({ error: 'Invalid email.' });


        const user_exist = await Person.findOne({ email: email });
        if (user_exist)
            return res.status(401).json({ error: 'User alerady exist got for log in.' });


        const data = req.body // perosn ka data he 
        // Create kia person ka data
        const newPerson = new Person(data);

        // 1 naya person add kia he
        const response = await newPerson.save();
        console.log('data saved');

        const payload = {
            id: response.id,
            email: response.email
        }
        const token = generateToken(payload);
        res.status(200).json({ response: response, token: token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// for login
router.post('/login', async (req, res) => {
    try {
        // Extract email and password hona
        const { email, password } = req.body;

        // Find the user by email
        const user = await Person.findOne({ email: email });

        // agr email or password match nhi kie to error ayegi bro
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // generate Token 
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({ token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server error' })
    }

});


router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = req.body //the request body contains person data

        //create a new person document using the mongose model
        const newPerson = new Person(data);
        const response = await newPerson.save();
        res.status(200).json(response);


    } catch (error) {
        console.log(error, 'error api person');
        res.status(500).json({ error: "Internal server error" })


    }
})

router.get('/:workType', jwtAuthMiddleware, async (req, res) => {
    try {
        const workType = req.params.workType;
        if (workType == "chef" || workType == "waiter" || workType == "manager") {
            const data = await Person.find({ work: workType });
            res.status(200).json(data);



        } else {
            res.status(404).json({ error: 'Internal Server error' })

        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Server error' })
    }

})

module.exports = router;