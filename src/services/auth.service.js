const { User } = require("../models");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

// User Registration
exports.register = async (email, password, role = "user") => {
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email,
    passwordHash: hash,
    role: role,
  });

  return user;
};

// User Login
exports.login = async (user) => {
  // generate tokens and save
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await user.save();

  // return the generated tokens
  return {
    accessToken,
    refreshToken
  }
};

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
