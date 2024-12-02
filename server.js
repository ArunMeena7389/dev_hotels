const express = require("express")
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const passport = require('passport');


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

//use routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('listening port 3030');

})