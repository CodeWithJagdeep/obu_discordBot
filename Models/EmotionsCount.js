const mongoose = require("mongoose");

const EmotionsCountSchema = new mongoose.Schema({
  userId: {
    type: String,
  },

  userName: { type: String },

  key: {
    type: String,
  },

  toUser: {
    type: String,
  },
  toUserName: { type: String },

  count: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CountModel = mongoose.model("Emotions", EmotionsCountSchema);

module.exports = CountModel;
