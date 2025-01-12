require("dotenv").config(); // To load environment variables from .env file

module.exports = {
  discordToken: process.env.DISCORD_TOKEN, // Bot token from .env
  TENOR_GIF_TOKEN: process.env.TENOR_GIF_TOKEN,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  prefix: process.env.PREFIX || "!", // Command prefix
  logLevel: process.env.LOG_LEVEL || "info", // Log level configuration
};
