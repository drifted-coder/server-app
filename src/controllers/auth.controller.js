const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const authService = require("../services/auth.service");

// User Registration
exports.register = async (req, res) => {
  const exists = await User.findOne({ email: req.body?.email });

  if (exists) {
    return res.status(403).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(req.body?.password, 10);

   const user = await User.create({
    email: req.body?.email,
    passwordHash: hash,
    role: "user",
  }); 

  return res.status(201).json({ message: "User registered successfully", user: user });
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await user.save();

  res.json({
    accessToken,
    refreshToken,
  });
};

// Token Refresh
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);

  if (!user) return res.sendStatus(401);

  const exists = user.refreshTokens.find((rt) => rt.token === refreshToken);

  if (!exists) return res.sendStatus(401);

  const newAccessToken = generateAccessToken(user);

  res.json({ accessToken: newAccessToken });
};

// User Logout

exports.logout = async (req, res, next) => {
  try {
    const { userId, refreshToken } = req.body;

    await authService.logout(userId, refreshToken);

    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (err) {
    next(err);
  }
};


