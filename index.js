const bot = require("./src/bot");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // CORS middleware for cross-origin requests
const helmet = require("helmet"); // Security middleware
const { connectDb } = require("./config/Db");
const bumpModel = require("./Models/BumpModel");
const GifModel = require("./Models/GIfModel");

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

app.get("/allgif", async (req, res) => {
  const { type } = req.query;

  const hasGif = await GifModel.findOne({
    type: type,
  });

  if (hasGif) {
    return res.status(201).json({
      status: "success",
      data: hasGif.gifs,
    });
  }
  return res.status(401).json({
    status: "success",
    data: [],
  });
});


/**
 * Endpoint to store selected GIFs based on type
 */
app.post("/selectedGif", async (req, res) => {
  const { gif, type } = req.body;

  const hasGif = await GifModel.findOne({
    type: type,
  });

  if (hasGif) {
    console.log(hasGif);
    const hasLink = hasGif.gifs.includes(gif);
    if (hasLink) {
      return res.status(201).json({
        status: "Success",
      });
    } else {
      hasGif.gifs.push(gif);
      await hasGif.save();
      return res.status(201).json({
        status: "Success",
      });
    }
  } else {
    await GifModel.create({
      type: type,
      gifs: [gif],
    });
    return res.status(201).json({
      status: "Success",
    });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
