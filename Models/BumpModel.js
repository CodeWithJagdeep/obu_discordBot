const mongoose = require("mongoose");

const bumpSchema = new mongoose.Schema({
  ChannelId: { type: String, required: true },
  guildId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const bumpModel = mongoose.model("bump", bumpSchema);

module.exports = bumpModel;
