require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../src/models");

(async()=>{

  await mongoose.connect(
    process.env.MONGO_URI
  );

  const exists =
    await User.findOne({ role:"admin" });

  if(!exists){

    const hash =
      await bcrypt.hash("Admin@123",10);

    await User.create({
      email:"admin@test.com",
      passwordHash:hash,
      role:"admin"
    });

    console.log("Admin created");
  }

  process.exit();
})();
