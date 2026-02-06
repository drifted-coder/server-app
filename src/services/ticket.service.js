const { Ticket } = require("../models");
const { logActivity } = require("../services/activity.service");

// create a ticket
exports.createTicket = async (data, userId) => {
  const ticket = await Ticket.create({
    ...data,
    createdBy: userId,
  });

  await logActivity({
    ticketId: ticket._id,
    type: "TICKET_CREATED",
    newValue: data,
    by: userId,
  });

  return ticket;
};

// update a ticket
exports.updateTicket = async (ticket, updates, user) => {
  const oldStatus = ticket.status;
  const oldPriority = ticket.priority;
  const oldAssigned = ticket.assignedTo;

  // USER RESTRICTIONS
  if (user.role === "user") {
    if (ticket.status !== "Open" || ticket.assignedTo) {
      throw new Error("User cannot edit this ticket");
    }

    ticket.title = updates.title ?? ticket.title;
    ticket.description = updates.description ?? ticket.description;
  }

  // AGENT / ADMIN
  else {
    if (updates.status) {
      if (updates.status === "Closed" && ticket.status !== "Resolved") {
        throw new Error("Ticket must be Resolved before Closed");
      }

      ticket.status = updates.status;
    }

    if (updates.priority) ticket.priority = updates.priority;

    if (updates.assignedTo) ticket.assignedTo = updates.assignedTo;
  }

  await ticket.save();

  // Activity Logging
  if (oldStatus !== ticket.status)
    await logActivity({
      ticketId: ticket._id,
      type: "STATUS_CHANGED",
      oldValue: oldStatus,
      newValue: ticket.status,
      by: user.id,
    });

  if (oldPriority !== ticket.priority)
    await logActivity({
      ticketId: ticket._id,
      type: "PRIORITY_CHANGED",
      oldValue: oldPriority,
      newValue: ticket.priority,
      by: user.id,
    });

  if (String(oldAssigned) !== String(ticket.assignedTo))
    await logActivity({
      ticketId: ticket._id,
      type: "ASSIGNED",
      oldValue: oldAssigned,
      newValue: ticket.assignedTo,
      by: user.id,
    });

  return ticket;
};

// soft delete a ticket
exports.softDeleteTicket = async (ticket) => {
  ticket.deletedAt = new Date();
  await ticket.save();
};

// get all tickets
exports.getTickets = async (query, user) => {
  const {
    search,
    status,
    priority,
    category,
    assignedTo,
    page = 1,
    limit = 20,
    sort = "newest",
  } = query;

  const filter = { deletedAt: null };

  if (search) filter.$text = { $search: search };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (assignedTo) filter.assignedTo = assignedTo;

  if (user.role === "user") filter.createdBy = user.id;

  const sortObj = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const tickets = await Ticket.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort(sortObj)
    .populate("createdBy assignedTo");

  const total = await Ticket.countDocuments(filter);

  return {
    tickets,
    total,
  };
};

// get ticket details by id
exports.getTicketDetailsById = async (query) => {
  try {
    const ticket = await Ticket.findById(query.params.id);

    if (!ticket) {
      return {
        message: "Ticket not found",
      };
    }

    //  If role is USER
    if (
      query.user.role === "user" &&
      ticket.createdBy.toString() !== query.user.id
    ) {
      return {
        message: "You can only access your own tickets",
      };
    }
    return ticket;
  } catch (err) {
    next(err);
  }
};
