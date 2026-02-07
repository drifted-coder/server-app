const Comment = require("../models/Comment.model");
const Ticket = require("../models/Ticket.model");
const { logActivity } = require("./activity.service");

exports.addComment = async (ticketId, message, user) => {

  const ticket = await Ticket.findById(ticketId);

  if (!ticket || ticket.deletedAt)
    throw new Error("Ticket not found");

  // RBAC
  if (
    user.role === "user" &&
    ticket.createdBy.toString() !== user.id
  ) {
    throw new Error("Not allowed to comment");
  }

  const comment = await Comment.create({
    ticketId,
    message,
    author: user.id
  });

  await logActivity({
    ticketId,
    type: "COMMENT_ADDED",
    newValue: message,
    by: user.id
  });

  return comment;
};

exports.getComments = async (ticketId, user) => {

  const ticket = await Ticket.findById(ticketId);

  if (!ticket)
    throw new Error("Ticket not found");

  if (
    user.role === "user" &&
    ticket.createdBy.toString() !== user.id
  ) {
    throw new Error("Forbidden");
  }

  return Comment
    .find({ ticketId })
    .populate("author", "email role")
    .sort({ createdAt: -1 });
};
