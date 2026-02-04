const service =
  require("../services/ticket.service");

exports.createTicket = async (req, res, next) => {
  try {
    const ticket =
      await service.createTicket(
        req.body,
        req.user.id
      );

    res.status(201).json(ticket);

  } catch (err) {
    next(err);
  }
};

exports.updateTicket = async (req, res, next) => {

  try {

    const updated =
      await service.updateTicket(
        req.ticket,
        req.body,
        req.user
      );

    res.json(updated);

  } catch (err) {
    next(err);
  }
};

exports.getTickets = async (req, res, next) => {

  try {

    const data =
      await service.getTickets(
        req.query,
        req.user
      );

    res.json(data);

  } catch (err) {
    next(err);
  }
};

exports.deleteTicket = async (req, res, next) => {

  try {

    await service.softDeleteTicket(
      req.ticket
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    next(err);
  }
};
