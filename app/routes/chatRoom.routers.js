const express = require("express");
const chatRoomController = require("../controllers/chatRoom.controller");

const router = express.Router();

router.route("/:chatRoomId").get(chatRoomController.getChatRoom);

module.exports = router;
