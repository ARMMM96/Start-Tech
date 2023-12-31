const ChatRoom = require("../database/models/chatRoom.model");
const userModel = require("../database/models/user.model");
const catchAsyncError = require("../utilities/catchAsyncError");
const ReqError = require("../utilities/ReqError");

exports.createChatRoom = async (chatRoomDetails) =>
  await ChatRoom.create(chatRoomDetails);

exports.getChatRoom = catchAsyncError(async (req, res, next) => {
  const chatRoom = await ChatRoom.findById(req.params.chatRoomId);
  if (!chatRoom) return next(new ReqError(400, "Chat does not exist"));

  res.status(200).json({
    status: "success",
    data: { chatRoom },
  });
});

exports.checkIfChatRoomExists = async (user, secondaryUser) => {
  let chatRoomId;
  // secondaryUser is the user not performing the action
  // Chat room exists if secondaryUser already has user as a contact
  secondaryUser.contacts.forEach((contact) => {
    if (contact.contactDetails.toString() === user._id.toString()) {
      chatRoomId = contact.chatRoomId;
    }
  });

  return chatRoomId;
};
exports.deleteChatRoom = async (chatRoomId) => {
  await ChatRoom.findByIdAndDelete(chatRoomId);
};

// Add message to chatroom
exports.addMessageToChatRoom = async (chatRoomId, message) => {
  const chatRoom = await ChatRoom.findById(chatRoomId);

  // Get last chatRoom day message
  const lastDayMessage =
    chatRoom.messageHistory[chatRoom.messageHistory.length - 1];

  // Get day message was sent
  const dayString = new Date(message.timeSent).toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  // Convert day string to milliseconds
  const day = new Date(dayString).getTime();

  // Add list of all members to message undelivered and unread members
  message.undeliveredMembers = chatRoom.members;
  message.unreadMembers = chatRoom.members.filter(
    (memberId) => memberId.toString() !== message.sender.toString()
  );

  // Check if day is today
  if (lastDayMessage?.day === day) {
    // Add to object if day is today
    lastDayMessage.messages.push(message);
  } else {
    // Else create new object for day
    const newDayObject = {
      day,
      messages: [message],
    };
    chatRoom.messageHistory.push(newDayObject);
  }

  await chatRoom.save();

  // Return message object included with message id
  const messageObj =
    chatRoom.messageHistory[chatRoom.messageHistory.length - 1].messages[
      chatRoom.messageHistory[chatRoom.messageHistory.length - 1].messages
        .length - 1
    ];

  return { messageObj, chatRoom, day };
};

// Check member off undelivered list in message
exports.checkMembersOffUndeliveredListInMessage = async ({
  membersId,
  messageId,
  chatRoomId,
  day,
  io,
}) => {
  const { message, chatRoom } = await this.getMessageFromChatRoom({
    day,
    messageId,
    chatRoomId,
  });

  if (!message) return;

  message.undeliveredMembers = message.undeliveredMembers.filter(
    (memberId) => !membersId.includes(memberId.toString())
  );

  if (!message.undeliveredMembers.length) {
    message.deliveredStatus = true;

    // Emit message been delivered
    io.to(chatRoomId).emit("user:messageDelivered", {
      messageId: message._id,
      senderId: message.sender,
      chatRoomId,
      day,
    });
  }

  await chatRoom.save();

  return {
    undeliveredMembers: message.undeliveredMembers,
    messageDelivered: message.deliveredStatus,
  };
};

// Add message as unread to users
exports.addMessageAsUndeliveredToUser = async ({
  undeliveredMembers,
  chatRoomId,
  messageId,
  day,
}) => {
  for (let memberId of undeliveredMembers) {
    const memberModel = await userModel.findById(memberId.toString());

    // If message hasn't been added as undelivered before, add
    memberModel.undeliveredMessages.push({
      day,
      chatRoomId,
      messageId,
    });

    await memberModel.save();
  }
};

exports.addMessageAsUnreadToUser = async ({
  unreadMembers,
  chatRoomId,
  messageId,
  day,
}) => {
  for (let memberId of unreadMembers) {
    const memberModel = await userModel.findById(memberId);

    memberModel.unreadMessages.push({
      day,
      chatRoomId,
      messageId,
    });

    await memberModel.save();
  }
};

// Mark messages as read by user
exports.markMessageAsReadByUser = async ({
  messageId,
  chatRoomId,
  day,
  userId,
  io,
}) => {
  const { message, chatRoom } = await this.getMessageFromChatRoom({
    messageId,
    chatRoomId,
    day,
  });

  if (!message) return;

  const user = await userModel.findById(userId);

  user.unreadMessages = user.unreadMessages.filter(
    (message) => message.messageId.toString() !== messageId.toString()
  );

  message.unreadMembers = message.unreadMembers.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );

  if (!message.unreadMembers.length) {
    message.readStatus = true;

    // Emit message as been read by all members
    io.to(chatRoomId).emit("user:messageReadByAllMembers", {
      messageId: message._id,
      senderId: message.sender,
      chatRoomId,
      day,
    });
  }

  await chatRoom.save();
  await userModel.save();
};
