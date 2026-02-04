const { Activity, Ticket } =
  require("../models");

exports.getActivity = async (req, res, next) => {

  try {

    const ticket =
      await Ticket.findById(req.params.id);

    if (!ticket)
      return res.sendStatus(404);

    if (
      req.user.role === "user" &&
      ticket.createdBy.toString() !== req.user.id
    ) {
      return res.sendStatus(403);
    }

    const activity =
      await Activity
        .find({ ticketId: req.params.id })
        .populate("by","email role")
        .sort({ at: -1 });

    res.json(activity);

  } catch (err) {
    next(err);
  }
};
