const router = require("express").Router();
const auth =
  require("../middlewares/auth.middleware");

const ctrl =
  require("../controllers/activity.controller");

router.use(auth);

router.get("/:id/activity",
  ctrl.getActivity);

module.exports = router;
