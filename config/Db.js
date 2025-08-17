const mongoose = require("mongoose");
const { MONGO_URL } = require("./env");

exports.connectDb = async () => {
  try {
    console.log(MONGO_URL);
    const connect = await mongoose.connect(MONGO_URL);
    if (connect) {
      console.log("db is connected");
    }
  } catch (err) {
    console.log(err);
  }
};
