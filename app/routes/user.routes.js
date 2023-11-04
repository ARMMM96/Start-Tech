const router = require("express").Router();
const userController = require("../controllers/users.controller");
const userModel = require("../database/models/user.model");
const checkDuplicate = require("../middlewares/checkDuplication.middleware");

const { authentication } = require("../middlewares/authentication.middleware");

router.get("/me", authentication, userController.profile);
router.post(
  "",
  checkDuplicate(userModel, "username"),
  userController.register
);
router.post("/auth", userController.login);

router.get("/:id", userController.getSingleUser);

router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUserData);
router.delete("/:id", userController.deleteUser);

module.exports = router;
