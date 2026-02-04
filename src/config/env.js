require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,

  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

  CLIENT_URL: process.env.CLIENT_URL,

  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
};
