const mongoose = require("mongoose");
require('dotenv').config();


// Mongodb URL define

// const mongoURL = process.env.localdb_url //database local
const mongoURL = process.env.mongodb_url; // databse monog


mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const db = mongoose.connection;

db.on('connected', () => {
    console.log("mongo db connected------yes");

})

db.on('error', (error) => {
    console.log("mongo db connected------error", error);

})

db.on('disconnected', () => {
    console.log("mongo db dis----connected------");

})
module.exports = db;