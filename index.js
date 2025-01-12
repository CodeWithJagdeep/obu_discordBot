const bot = require("./bot");
const { connectDB, sequelize } = require("./config/dbConfig");

bot.start();

sequelize
  .sync({ force: false }) // Set force: true only in development to drop and recreate tables
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((error) => {
    console.log("Please check if the database is connect or not");
    console.log("Error syncing database:", error);
  });

connectDB();
