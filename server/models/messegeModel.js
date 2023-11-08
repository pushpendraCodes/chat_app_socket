const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

module.exports = module.exports = mongoose.model("Messages", MessageSchema);
