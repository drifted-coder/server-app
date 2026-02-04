const Comment = require("../models/Comment.model");

exports.addComment = async (data) => {
  const comment = await Comment.create(data);
  return comment;
};

exports.getCommentsByTicket = async (ticketId) => {
  return await Comment.find({ ticketId }).sort({ createdAt: -1 });
};
