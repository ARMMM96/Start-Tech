const router = require("express").Router();
const userController = require("../controllers/users.controller");
const userModel = require("../database/models/user.model");
const checkDuplicate = require("../middlewares/checkDuplication.middleware");

const { authentication } = require("../middlewares/authentication.middleware");

router.get("/me", authentication, userController.profile);
router.post(
  "/register",
  checkDuplicate(userModel, "username"),
  userController.register
);
router.post("/login", userController.login);
router.post(
  "/change-password/:id",
  authentication,
  userController.changePassword
);
router.get("/get/:id", authentication, userController.getSingleUser);

router.get("/all", authentication, userController.getAllUsers);
router.put("/update/:id", authentication, userController.updateUserData);
router.delete("/delete/:id", authentication, userController.deleteUser);

module.exports = router;
