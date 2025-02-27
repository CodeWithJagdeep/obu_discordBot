require("dotenv").config(); // To load environment variables from .env file

module.exports = {
  discordToken: process.env.DISCORD_TOKEN, // Bot token from .env
  TENOR_GIF_TOKEN: process.env.TENOR_GIF_TOKEN,
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_CLIENT_ID: process.env.BOT_CLIENT_ID,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  prefix: process.env.PREFIX || "!", // Command prefix
  logLevel: process.env.LOG_LEVEL || "info", // Log level configuration
  MONGO_URL: process.env.MONGO_URL || "",
  YOUTUBE_API: process.env.YOUTUBE_API || "",
};
