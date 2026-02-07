const { User } = require("../models");
const authService = require("../services/auth.service");
const bcrypt = require("bcrypt");
const {
  verifyRefreshToken,
  generateAccessToken,
} = require("../utils/jwt");

// User Registration
exports.register = async (req, res) => {
  const exists = await User.findOne({ email: req.body?.email });

  // check whether the user exists in database or not
  if (exists) {
    return res.status(403).json({ message: "User already exists" });
  }

  try {
    var user = await authService.register(
      req.body.email,
      req.body.password,
      req.body?.role,
    );
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    return;
  }

  // return user back to client
  return res
    .status(201)
    .json({ message: "User registered successfully", user: user });
};

// User Login
exports.login = async (req, res) => {
  // Destructure the email and password
  const { email, password } = req.body;

  // get the tokens
  try {
    // check user exists or not
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // check credentials matches or not
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const tokens = await authService.login(user);

    if (tokens) {
      const { accessToken, refreshToken } = tokens;
      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json({
        message: "Please provide valid credentials",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Token Refresh
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required",
      });
    }

    // ✅ Verify Refresh Token
    const decoded = verifyRefreshToken(refreshToken);

    // ✅ Find User
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.sendStatus(401);
    }

    // ✅ Check Token Exists In DB
    const exists = user.refreshTokens.find(
      (rt) => rt.token === refreshToken
    );

    if (!exists) {
      return res.sendStatus(401);
    }

    // ✅ Generate New Access Token
    const newAccessToken = generateAccessToken(user);

    return res.json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    next(error);
  }
};

// User Logout
exports.logout = async (req, res, next) => {
  try {
    const { userId, refreshToken } = req.body;

    // Validate inputs
    if (!userId || !refreshToken) {
      return res
        .status(400)
        .json({ message: "User ID and refresh token are required" });
    }

    await authService.logout(userId, refreshToken);

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
