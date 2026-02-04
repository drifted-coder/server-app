const { Comment, Ticket } = require("../models");
const { logActivity } = require("../services/activity.service");
const service = require("../services/comment.service");

exports.addComment = async (
  ticketId,
  message,
  user
) => {

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

exports.addComment = async (req, res, next) => {

  try {

    const comment =
      await service.addComment(
        req.params.id,
        req.body.message,
        req.user
      );

    res.status(201).json(comment);

  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {

  try {

    const comments =
      await service.getComments(
        req.params.id,
        req.user
      );

    res.json(comments);

  } catch (err) {
    next(err);
  }
};
