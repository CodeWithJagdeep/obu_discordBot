const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  ChannelId: { type: String, required: true },
  GameStatus: { type: Boolean, default: false },
  participants: [
    {
      userId: String,
      submission: Boolean,
      sequence: Number,
      thought: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const GameModel = mongoose.model("game", gameSchema);

module.exports = GameModel;
