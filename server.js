const express = require("express")
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//image need 
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path')
app.use(cors());
app.use(express.static('uploads'));

const passport = require('passport');

//for image-----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "" + Math.floor(Math.random() * 1000000) + '.png')
  }
})

// app.get('/img/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const image = await MenuItem.findOne({ image_url: id })
//     if (!image) return res.send({ "msg": "image not found" })
//     const imagePath = path.join(__dirname, "uploads", image.image_url)
//     res.sendFile(imagePath)
//   } catch {
//     res.status(401).json({ message: 'something failed' });
//   }
// })

app.get('/img/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await MenuItem.findOne({ image_url: id });
    if (!image) return res.status(404).json({ msg: "Image metadata not found in DB" });

    const imagePath = path.join(__dirname, "uploads", image.image_url);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ msg: "Image file not found on server" });
    }

    res.sendFile(imagePath);
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).json({ message: 'Something failed on the server' });
  }
});
//--------------------------------


const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', { session: false })


// Set up a secret key for JWT
const secretKey = 'arun7389';

// User login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Authenticate the user and generate a JWT if login is successful
  // Check if the provided password matches the hashed password in the database
  if (bcrypt.compareSync(password, hashedPasswordFromDatabase)) {
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

//Import route file
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');
const MenuItem = require("./modules/MenuItem");
const CategoryRoutes = require('./routes/CategoryRoutes');
const OrderListData = require('./routes/OrderListRoute');
const MobileOtp = require('./routes/sentOTPmobile');
const CustomerAdd = require('./routes/CustomerRoute');


//use routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);
app.use('/category', CategoryRoutes);
app.use('/order', OrderListData);
app.use('/mobile', MobileOtp);
app.use('/customer', CustomerAdd);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('listening port ' + PORT);

})