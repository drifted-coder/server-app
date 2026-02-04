const jwt = require("jsonwebtoken");
const env = require("../config/env");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY }
  );
};

exports.verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_SECRET);

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET);
