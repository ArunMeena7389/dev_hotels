const express = require("express")
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//image need 
const multer = require('multer');
const cors = require('cors');
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

const upload = multer({ storage })

app.post('/single', upload.single('image'), async (req, res) => {
  try {
    const { path, filename } = req.file;
    const image = await ImageModel({ path, filename })
    await image.save()
    res.status(200).send({ "filename": filename, "id": image.id })

  } catch (err) {
    res.status(401).json({ message: 'something failed' });

  }
})

app.get('/images/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await ImageModel.findOne({ filename: id })
    if (!image) return res.send({ "msg": "image not found" })
    const imagePath = path.join(__dirname, "uploads", image.filename)
    res.sendFile(imagePath)
  } catch {
    res.status(401).json({ message: 'something failed' });
  }
})

app.get('/img/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await MenuItem.findOne({ image_url: id })
    if (!image) return res.send({ "msg": "image not found" })
    const imagePath = path.join(__dirname, "uploads", image.image_url)
    res.sendFile(imagePath)
  } catch {
    res.status(401).json({ message: 'something failed' });
  }
})
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

app.get('/', function (req, res) {
  res.send('Welcome to my data base')
})



//Import route file
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');
const ImageModel = require("./modules/image_model");
const MenuItem = require("./modules/MenuItem");

//use routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('listening port 5000');

})