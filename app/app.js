const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const toobusy = require("toobusy-js");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());


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

module.exports = app;