const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  username: {
    unique: true,
    type: String,
    required: true,
    lower: true,
  },
  firstName: {
    type: String,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 20,
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,

    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email format");
      }
    },
  },
  bio: {
    type: String,
    min: 1,
    max: 100,
    default: "Please Update your bio.....",
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
    minLength: 5,
    required: true,
    validate(value) {
      const isValidpassword = validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
      });
      if (!isValidpassword) {
        throw new Error("invalid password format");
      }
    },
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (givenPassword) {
        return givenPassword === this.password;
      },
      message: "Passwords do not match",
    },
  },
  phoneNumber: {
    type: String,
  },
  status: {
    online: { type: Boolean, default: true },
    lastSeen: Date,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  tokens: [
    {
      token: { type: String },
    },
  ],
  // Chat rooms user belongs to
  chatRooms: [mongoose.Schema.Types.ObjectId],
  // Pinned chat rooms by user
  pinnedChatRooms: [],
  // Unread messages
  unreadMessages: [{}],
  // Undelivered messages
  undeliveredMessages: [{}],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
