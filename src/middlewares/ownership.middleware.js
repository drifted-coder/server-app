const { Ticket } = require("../models");

module.exports = async function(req, res, next) {

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket)
    return res.status(404).json({ message: "Ticket not found" });

  if (
    req.user.role === "user" &&
    ticket.createdBy.toString() !== req.user.id
  ) {
    return res.status(403).json({
      message: "Not allowed"
    });
  }

  req.ticket = ticket;
  next();
};
