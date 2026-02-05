const router = require("express").Router();
const auth =
  require("../middlewares/auth.middleware");
const role =
  require("../middlewares/role.middleware");

const ctrl =
  require("../controllers/dashboard.controller");

router.use(auth);

router.get("/",
  role("admin","agent"),
  ctrl.agentDashboard);

router.get("/user",
  role("user"),
  ctrl.userDashboard);

module.exports = router;