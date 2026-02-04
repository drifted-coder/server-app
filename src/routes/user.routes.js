const router = require("express").Router();
const auth =
  require("../middlewares/auth.middleware");
const role =
  require("../middlewares/role.middleware");

const ctrl =
  require("../controllers/user.controller");

router.use(auth);

router.get("/",
  role("admin"),
  ctrl.getUsers);

router.patch("/:id",
  role("admin"),
  ctrl.updateUser);

module.exports = router;
