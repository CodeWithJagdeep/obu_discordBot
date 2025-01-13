const MemeController = require("../Controllers/MemeController");

exports.memeEvents = (channel) => {
  try {
    MemeController.sendMeme(channel);
  } catch (err) {}
};
