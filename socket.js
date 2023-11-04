const socketIO = require("socket.io");
const { expressServer } = require("./index");

const {
  onlineController,
  offlineController,
  disconnectingController,
  joinRoomController,
} = require("./app/socketControllers/connectionController");
const {
  messagingController,
  markMessageReadController,
} = require("./app/socketControllers/messageController");


const io = socketIO(expressServer);

io.on("connection", async (socket) => {
  // -------------Connection controls -------------- //
  // socket come online
  onlineController(io, socket);

  // socket goes offline
  offlineController(io, socket);

  // socket disconnecting
  disconnectingController(io, socket);

  // socket joins new room
  joinRoomController(io, socket);
  //--------------------------------------------------//

  // -------------User Action controls -------------- //
  // User typing
  typingController(io, socket);

  // User recording
  recordingcontroller(io, socket);

  // User clears chat room
  clearChatRoomController(io, socket);
  //--------------------------------------------------//

  // -------------Message controls -------------- //
  // User sends message
  messagingController(io, socket);

  // User reads message
  markMessageReadController(io, socket);

  //--------------------------------------------------//
});
