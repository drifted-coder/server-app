const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120,
    trim: true
  },

  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000
  },

  category: {
    type: String,
    enum: ["Bug", "Billing", "Feature Request", "Other"],
    required: true,
    index: true
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Low",
    index: true
  },

  status: {
    type: String,
    enum: ["Open", "In Progress", "Waiting for User", "Resolved", "Closed"],
    default: "Open",
    index: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true
  },

  deletedAt: {
    type: Date,
    default: null,
    index: true
  }

}, { timestamps: true });

// Text Search Index

ticketSchema.index({
  title: "text",
  description: "text"
});

//Compound Index for Filters

ticketSchema.index({
  status: 1,
  priority: 1,
  category: 1,
  assignedTo: 1,
  createdBy: 1
});

module.exports = mongoose.model("Ticket", ticketSchema);
