const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  guildId: { type: String },
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model("UserActivity", userActivitySchema);
