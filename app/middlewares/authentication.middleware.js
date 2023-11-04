const userModel = require("../database/models/user.model");
const helper = require("../helpers/helpers");
const jwt = require("jsonwebtoken");
const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authentication").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.tokenPassword);
    const userData = await userModel.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });
    if (!userData) {
      helper.responseHandler(res, 404, false, null, "In valid token");
      return;
    }
    req.user = userData;
    req.token = token;
    next();
  } catch (e) {
    helper.responseHandler(
      res,
      500,
      false,
      e.message,
      "Unauthenticated request"
    );
  }
};
module.exports = { authentication };
