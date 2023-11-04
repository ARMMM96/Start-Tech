require("dotenv").config();
const app = require("./app/app");
const colors = require("colors");

//   Listen to port
exports.expressServer = app.listen(process.env.PORT, () =>
  console.log(`http://localhost:${process.env.PORT}`.bold.brightBlue.underline)
);
