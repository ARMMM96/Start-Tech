const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const toobusy = require("toobusy-js");
const app = express();
const connectDB = require("./database/connection");
require("dotenv").config();
const colors = require("colors");


// Database connection
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const userRoutes = require("./routes/user.routes");
const chatRoomRouter = require('./routes/chatRoom.routers')

app.use("/api/users/", userRoutes);
app.use("/api/chatRoom", chatRoomRouter);


app.use(function (req, res, next) {
  if (toobusy()) {
    res.send(503, "Server too busy!");
  } else {
    next();
  }
});

app.all("*", (req, res) => {
  res.status(404).send({
    apisStatus: false,
    message: "Invalid URL",
    data: {},
  });
});
app.listen(process.env.PORT, () =>
console.log(`http://localhost:${process.env.PORT}`.bold.brightBlue.underline)
);
module.exports = app;
