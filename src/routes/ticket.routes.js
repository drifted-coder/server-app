const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const ownership = require("../middlewares/ownership.middleware");

const ctrl = require("../controllers/ticket.controller");

router.use(auth);

router.post("/", ctrl.createTicket);

router.get("/", ctrl.getTickets).get("/:id", ctrl.getTicketsById);

router.patch("/:id", ownership, ctrl.updateTicket);

router.delete("/:id", role("admin", "agent"), ownership, ctrl.deleteTicket);

module.exports = router;
