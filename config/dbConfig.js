const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./env");

// Get the MySQL URL, fallback to the default if not available
const mysqlURL =
  DATABASE_URL || "mysql://root:yourpassword@localhost:3306/mydb";

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize(mysqlURL, {
  dialect: "mysql",
  logging: false, // Set to true if you want to log SQL queries
});

// Connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");
  } catch (error) {
    console.error("MySQL connection error:", error);
  }
};

module.exports = { connectDB, sequelize };
