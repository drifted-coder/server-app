const { User } = require("../models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { role, active } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, active },
      { new: true },
    );

    res.json(user);
  } catch (err) {
    next(err);
  }
};
