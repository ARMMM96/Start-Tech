const router = require("express").Router();
const userController = require("../controllers/users.controller");
const userModel = require("../database/models/user.model");
const checkDuplicate = require("../middlewares/checkDuplication.middleware");

const { authentication } = require("../middlewares/authentication.middleware");

router.post("", checkDuplicate(userModel, "username"), userController.register);
router.post("/auth", userController.login);

router.get("/me", authentication, userController.profile);

router.get("/:id", authentication, userController.getSingleUser);
router.get("/", authentication, userController.getAllUsers);
router.put("/:id", authentication, userController.updateUserData);
router.delete("/:id", authentication, userController.deleteUser);

module.exports = router;
