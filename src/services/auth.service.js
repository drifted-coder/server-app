const { User } = require("../models");

// Logout functionality
exports.logout = async (userId, refreshToken) => {
  await User.updateOne(
    { _id: userId },
    {
      $pull: {
        refreshTokens: {
          token: refreshToken,
        },
      },
    },
  );
};

// User Registration
exports.register = async (email, password) => {
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email,
    passwordHash: hash,
    role: "user",
  });

  return user;
};
