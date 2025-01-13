const path = require("path");
const fs = require("fs");
const axios = require("axios"); // Import axios
const { memes } = require("../data/memes");

class MemeController {
  constructor() {}

  // Function to load the current index from the file
  loadCurrentIndex(file) {
    if (fs.existsSync(file)) {
      try {
        const savedIndex = parseInt(fs.readFileSync(file, "utf-8"), 10);
        if (!isNaN(savedIndex)) {
          return savedIndex; // Return the saved index if valid
        }
      } catch (err) {
        console.error("Error reading the file:", err.message);
      }
    }
    return 0; // Return default if file doesn't exist or is invalid
  }

  async sendMeme(channel) {
    const file = path.join(__dirname, "..", "memeIndex.txt"); // Path to the file

    let currentIndex = this.loadCurrentIndex(file); // Initialize the current index from file

    // Set an interval for periodic reminders
    setInterval(async () => {
      // Fetch the meme image
      try {
        console.log("here");
        const response = await axios({
          url: memes[currentIndex],
          method: "GET",
          responseType: "arraybuffer", // Fetch the image as binary data
        });

        // Convert the binary data to a buffer
        const buffer = Buffer.from(response.data, "binary");

        // Send the image to the specified Discord channel
        if (channel) {
          await channel.send({
            files: [{ attachment: buffer, name: "image.jpg" }], // Replace with the desired file name
          });
          // console.log(`Meme sent: ${memes[currentIndex]}`);
        } else {
          console.error("Channel not found!");
        }
      } catch (err) {
        console.error("Error sending meme:", err.message);
      }

      // Increment the index
      currentIndex += 1;

      // Save the updated index to the file
      try {
        fs.writeFileSync(file, currentIndex.toString(), "utf-8");
        // console.log(`Current index saved: ${currentIndex}`);
      } catch (err) {
        console.error("Error saving the index to file:", err.message);
      }

      // If the currentIndex exceeds the meme array, reset it
      if (currentIndex >= memes.length) {
        currentIndex = 0;
      }
    }, 30 * 60 * 1000); // Reminder every 30 minutes
  }
}

module.exports = new MemeController();
