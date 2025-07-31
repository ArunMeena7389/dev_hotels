const express = require("express")
const router = express.Router();
const jwt = require('jsonwebtoken');

const Person = require('../Schema/person')
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const { isEmailValid } = require("../Hellps/content");

// POST route to add a person

const crypto = require('crypto');
const { sendOTP } = require("../Utils/Mailer");

function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

let otpStore = {}; // For demo. Use Redis or DB in prod.

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!isEmailValid(email)) return res.status(400).json({ error: 'Email required' });
    const user_exist = await Person.findOne({ email: email });
    if (user_exist)
        return res.status(401).json({ error: 'User alerady exist go for log in.' });

    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 mins

    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent' });
});

router.post('/register', async (req, res) => {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp)
        return res.status(400).json({ error: 'All fields are required' });

    if (!otpStore[email] || otpStore[email].otp !== otp || Date.now() > otpStore[email].expires) {
        return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    delete otpStore[email];

    const newUser = new Person({ name, email, password });
    const response = await newUser.save();

    const token = generateToken({ id: response._id, email: response.email });
    res.status(200).json({ response, token });
});

// for login
router.post('/login', async (req, res) => {
    try {
        // Extract email and password hona
        const { email, password } = req.body;

        // Find the user by email
        const response = await Person.findOne({ email: email });

        // agr email or password match nhi kie to error ayegi bro
        if (!response || !(await response.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // generate Token 
        const payload = {
            id: response.id,
            email: response.email
        }
        const token = generateToken(payload);

        // resturn token as response
        res.status(200).json({ response, token });
    } catch (err) {
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
        res.status(500).json({ error: "Internal server error" })


    }
})

// for refresh token 
router.post('/refresh-token', async (req, res) => {
  const { token } = req.body; // 🔁 client sends the expired token

  if (!token) return res.status(401).json({ error: 'Token is required' });

  try {
    // Decode without verifying expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    // Optional: Verify user still exists
    const user = await Person.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Re-issue new token
    const newToken = generateToken({ id: user.id, email: user.email });
    res.status(200).json({ token: newToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid token' });
  }
});


module.exports = router;