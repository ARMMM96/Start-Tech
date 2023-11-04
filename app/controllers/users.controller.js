const userModel = require("../database/models/user.model");
const helper = require("../helpers/helpers");
const multer = require("multer");
const bcryptjs = require("bcryptjs");
const upload = require("../middlewares/imageUpload.middleware");

class User {
  static register = async (req, res) => {
    try {
      const userData = new userModel(req.body);
      await userData.save();

      helper.responseHandler(
        res,
        201,
        true,
        userData,
        "User registered successfully"
      );
    } catch (e) {
      helper.responseHandler(res, 500, false, e, e.message);
    }
  };

  static login = async (req, res) => {
    try {
      const userData = await userModel.loginUser(
        req.body.username,
        req.body.password
      );
      const token = await userData.generateToken();
      helper.responseHandler(
        res,
        200,
        true,
        { user: userData, token },
        "user logedIn successfully"
      );
    } catch (e) {
      helper.responseHandler(res, 500, false, e, e.message);
    }
  };
  static profile = (req, res) => {
    helper.responseHandler(
      res,
      200,
      true,
      { user: req.user },
      "user profile fetched"
    );
  };
  static getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
      const userData = await userModel.findById(id).populate("role");
      if (!userData) {
        helper.responseHandler(res, 404, false, null, "User Is not exist");
      } else {
        helper.responseHandler(res, 200, true, userData, "User found");
      }
    } catch (e) {
      helper.responseHandler(res, 500, false, e, e.message);
    }
  };
  static getAllUsers = async (req, res) => {
    try {
      const usersData = await userModel.find().populate("role");
      if (!usersData || usersData.length == 0) {
        helper.responseHandler(res, 404, false, null, "Users Is not exist");
      } else {
        helper.responseHandler(res, 200, true, usersData, "User found");
      }
    } catch (e) {
      helper.responseHandler(res, 500, false, e, e.message);
    }
  };
  static updateUserData = async (req, res) => {
    try {
      const userData = await userModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!userData) {
        helper.responseHandler(res, 404, false, null, "User Is not exist");
      } else {
        helper.responseHandler(res, 200, true, userData, "User updated");
      }
    } catch (e) {
      helper.responseHandler(res, 500, false, e, e.message);
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const userData = await userModel.findByIdAndRemove(req.params.id);

      if (!userData) {
        helper.responseHandler(res, 404, false, null, "User Is not exist");
      } else {
        helper.responseHandler(res, 200, true, userData, "User deleted");
      }
    } catch (e) {
      helper.responseHandler(res, 500, false, e, e.message);
    }
  };

  static profilePicture = async (req, res) => {
    try {
      const uploadImage = upload.single("img");
      uploadImage(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.send({ err: "invalid upload" });
        } else if (err) {
          return res.send({ err: "invalid upload 1" });
        }
        req.user.avatar = req.file.path;
        await req.user.save();
        helper.responseHandler(res, 200, true, req.user, "updated");
      });
    } catch (e) {
      helper.responseHandler(res, 500, false, e, e.message);
    }
  };

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body; // Get the user ID, current password, and new password from the request body

      const id = req.params.id;
      const user = await userModel.findById(id); // Find the user based on their ID

      if (!user) {
        helper.responseHandler(res, 404, false, user, "User not found");
      } else {
        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) {
          helper.responseHandler(
            res,
            400,
            false,
            null,
            "Current password is incorrect"
          );
        } else {
          const userData = await userModel.findByIdAndUpdate(
            req.params.id,
            { password: newPassword },
            { new: true }
          );
        }
        helper.responseHandler(
          res,
          200,
          true,
          user,
          "Password changed successfully"
        );
      }
    } catch (e) {
      console.error(e.message);
      helper.responseHandler(res, 500, false, e, e.message);
    }
  }


}
module.exports = User;
