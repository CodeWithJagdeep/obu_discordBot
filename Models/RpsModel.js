const mongoose = require("mongoose");

const RPSSchema = new mongoose.Schema({
  guildId: { type: String },
  channelId: { type: String },
  challengerId: { type: String },
  changerName: { type: String },
  opponentName: { type: String },
  opponentId: { type: String },
  wins: { type: Number, default: 0 },
  loss: { type: Number, default: 0 },
  playedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("rpsGame", RPSSchema);
