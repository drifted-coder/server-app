const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middlewares/error.middleware");

const app = express();


// =======================
// ENV VARIABLES
// =======================
const LOGIN_RATE_LIMIT_WINDOW =
  parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW) || 10;

const LOGIN_RATE_LIMIT_MAX =
  parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5;


// =======================
// RATE LIMITER
// =======================
// const loginLimiter = rateLimit({
//   windowMs: LOGIN_RATE_LIMIT_WINDOW * 60 * 1000,
//   max: LOGIN_RATE_LIMIT_MAX,
//   message: "Too many login attempts. Try again later.",
// });


// =======================
// GLOBAL MIDDLEWARES
// =======================
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());


// =======================
// ROUTES
// =======================

// Apply limiter ONLY to login
// app.use("/api/auth/login", loginLimiter);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/tickets", require("./routes/ticket.routes"));
app.use("/api/tickets", require("./routes/comment.routes"));
app.use("/api/tickets", require("./routes/activity.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));


// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use(errorHandler);


module.exports = app;
