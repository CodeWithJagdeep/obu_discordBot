const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Database Configuration
// -------------------------------
const DATABASE_URL = process.env.DATABASE_URL; // Full DB connection string

module.exports = { DATABASE_URL };
