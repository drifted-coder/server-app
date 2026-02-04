const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
    index: true
  },

  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 2000
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  }

}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("Comment", commentSchema);
