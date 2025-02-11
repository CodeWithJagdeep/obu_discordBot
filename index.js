const bot = require("./src/bot");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // CORS middleware for cross-origin requests
const helmet = require("helmet"); // Security middleware
const { connectDb } = require("./config/Db");
const bumpModel = require("./Models/BumpModel");

const app = express();
const PORT = 8888;

// Middleware for security headers
app.use(helmet());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend access
app.use(cors());

// Middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to the database
connectDb();

// Start the bot
bot.start();

app.get("/allbump", async (req, res) => {
  const bumps = await bumpModel.find();
  return res.status(200).json({
    status: "success",
    data: bumps,
  });
});

app.get("/allgif", (req, res) => {
  const { type } = req.query;

  const filePath = path.join(__dirname, `${type}.txt`);
  // Asynchronously read the file
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("❌ Error reading file:", err);
      return res.status(500).json({ error: "Error reading the file" });
    }

    let array = data ? JSON.parse(data) : [];

    return res.status(201).json({
      data: array,
    });
  });
});
/**
 * Endpoint to store selected GIFs based on type
 */
app.post("/selectedGif", (req, res) => {
  const { gif, type } = req.body;

  if (!gif || !type) {
    return res.status(400).json({ error: "Gif and type are required" });
  }

  const filePath = path.join(__dirname, `${type}.txt`);

  // Asynchronously read the file
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("❌ Error reading file:", err);
      return res.status(500).json({ error: "Error reading the file" });
    }

    let array = data ? JSON.parse(data) : [];
    array.push(...gif);

    // Asynchronously append the new GIF URLs to the file
    fs.writeFile(filePath, `${JSON.stringify(array)}\n`, (err) => {
      if (err) {
        console.error("❌ Error writing to file:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while saving the gif" });
      }

      console.log(`✅ GIF added to ${type}.txt: ${gif}`);
      return res.status(200).json({
        message: `Gif added to ${type}.txt successfully!`,
      });
    });
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
