const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

//DB
require("./db");
const corsOptions = require("./Middleware/corsOptions");

const app = express();
app.use(express.static("uploads"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(passport.initialize());

// Http + Socket
const server = http.createServer(app);
require("./project_root/socket")(server); 


//Import route file
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");
const OrderListData = require("./routes/OrderListRoute");
const MobileOtp = require("./routes/sentOTPmobile");
const CustomerAdd = require("./routes/CustomerRoute");
const AiDescription = require("./routes/AiRoute");
const PackageRoute = require("./routes/PackageRoute");

//use routes
app.use("/person", personRoutes);
app.use("/menu", menuRoutes);
app.use("/category", CategoryRoutes);
app.use("/order", OrderListData);
app.use("/mobile", MobileOtp);
app.use("/customer", CustomerAdd);
app.use("/ai", AiDescription);
app.use("/package",PackageRoute);

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log("listening port " + PORT);
// });
server.listen(PORT, () => {
  console.log("Socket.IO server listening on port " + PORT);
});
