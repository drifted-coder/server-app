const { Activity } = require("../models");

exports.logActivity = async ({
  ticketId,
  type,
  oldValue,
  newValue,
  by
}) => {

  await Activity.create({
    ticketId,
    type,
    oldValue,
    newValue,
    by
  });
};
