const mongoose = require("mongoose");

// Mongodb URL define

// const mongoURL = process.env.localdb_url //database local
const mongoURL = process.env.mongoURL; // databse monog

mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("mongo db connected------yes");
    
})

db.on('error',(error)=>{
    console.log("mongo db connected------error",error);
    
})

db.on('disconnected',()=>{
    console.log("mongo db dis----connected------");
    
})
module.exports = db;