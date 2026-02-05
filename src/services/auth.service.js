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
exports.login = async (email, password) => {

  // check user exists or not
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // check credentials matches or not
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

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

// Refresh Token
exports.refresh = async(refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);

  if (!user) return res.sendStatus(401);

  const exists = user.refreshTokens.find((rt) => rt.token === refreshToken);

  if (!exists) return res.sendStatus(401);

  const newAccessToken = generateAccessToken(user);

  return newAccessToken;
}
