const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl =
  require("../controllers/comment.controller");

router.use(auth);

router.post("/:id/comments",
  ctrl.addComment);

router.get("/:id/comments",
  ctrl.getComments);

module.exports = router;
