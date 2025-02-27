const mongoose = require("mongoose");

const gifSchema = new mongoose.Schema({
  type: String,
  gifs: [String],
  createdAt: { type: Date, default: Date.now },
});

const GifModel = mongoose.model("gifs", gifSchema);

module.exports = GifModel;
