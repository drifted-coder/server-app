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
  try{
    const tokens = await authService.login(email, password);
  
    if (tokens) {
      const {accessToken, refreshToken} = tokens;
      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json({
        message: "Please provide valid credentials"
      });
    }
  }
  catch(error){
    next(error)
  }
};

// Token Refresh
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  try{
    const newAccessToken = await authService.refresh(refreshToken)
    res.json({ accessToken: newAccessToken });
  }
  catch(error){
    next(error)
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
