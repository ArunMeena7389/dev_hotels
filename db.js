const mongoose = require("mongoose");
require('dotenv').config();


// Mongodb URL define

// const mongoURL = process.env.localdb_url //database local
const mongoURL = process.env.mongodb_url; // databse monog


mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

// module.exports = async () => {
//     console.log(mongoURL,'--------------mongoURL');

//     try {
//         await mongoose.connect(mongoURL, {
//             useNewUrlParser:true,
//             useUnifiedTopology:true
//         });
//         console.log("CONNECTED TO DATABASE SUCCESSFULLY");
//     } catch (error) {
//         console.error('COULD NOT CONNECT TO DATABASE:', error.message);
//     }
// };

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