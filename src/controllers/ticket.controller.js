const service = require("../services/ticket.service");

// create a ticket
exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await service.createTicket(req.body, req.user.id);

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

// update a specific ticket
exports.updateTicket = async (req, res, next) => {
  try {
    const updated = await service.updateTicket(req.ticket, req.body, req.user);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// get all tickets
exports.getTickets = async (req, res, next) => {
  try {
    const data = await service.getTickets(req.query, req.user);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// get ticket by id
exports.getTicketsById = async (req, res, next) => {
  try {
    const movie = await service.getTicketDetailsById({id: req.params.id});
    res.status(200).json(movie);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching ticket", details: error.message });
    next(error);
  }
};

// soft delete a ticket
exports.deleteTicket = async (req, res, next) => {
  try {
    await service.softDeleteTicket(req.ticket);

    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
