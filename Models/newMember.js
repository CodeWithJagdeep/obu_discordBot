const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema({
  guildId: { type: String },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const bumpModel = mongoose.model("bump", bumpSchema);

module.exports = bumpModel;
