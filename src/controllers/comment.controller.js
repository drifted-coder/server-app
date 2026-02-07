const service = require("../services/comment.service");

exports.addComment = async (req, res, next) => {
  try {

    const comment = await service.addComment(
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

    const comments = await service.getComments(
      req.params.id,
      req.user
    );

    res.json(comments);

  } catch (err) {
    next(err);
  }
};
