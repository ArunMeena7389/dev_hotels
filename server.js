const express = require("express")
const app = express();

const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', function(req,res){
    res.send('Welcome to my data base')
})


//Import route file
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');

//use routes
app.use('/person',personRoutes);
app.use('/menu',menuRoutes);

const PORT = process.env.PORT ||3030
app.listen(PORT,()=>{
    console.log('listening port 3030');
    
})