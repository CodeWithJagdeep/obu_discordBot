const bot = require("./bot");
const express = require("express");

const app = express();
bot.start();

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
