const mongoose = require("mongoose");

const welcomeSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true, // Ensure guildId is required
      unique: true, // Ensure each guild has only one welcome settings document
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    channelId: {
      type: String, // Store the channel ID for welcome messages
      default: null,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const WelcomeModel = mongoose.model("Welcome", welcomeSchema);

module.exports = WelcomeModel;
