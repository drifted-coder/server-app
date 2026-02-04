const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");

connectDB(env.MONGO_URI);

app.listen(env.PORT, () =>
  console.log(`Server running on ${env.PORT}`)
);
