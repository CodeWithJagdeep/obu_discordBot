const path = require("path");
const fs = require("fs");

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
    return currentIndex; // Return default if file doesn't exist or is invalid
  }

  async sendMeme(client) {
    let currentIndex = 1; // Default starting index if the file doesn't exist
    const file = path.join(__dirname, "..", "memeIndex.txt"); // Path to the file
    // Load the index from
    console.log(file);
    // the file when the script starts
    currentIndex = this.loadCurrentIndex(file);

    // Set an interval for periodic reminders
    setInterval(async () => {
      const channel = client.channels.cache.find(
        (ch) => ch.name === "😂・memes"
      );

      // Save the current index to the file
      try {
        fs.writeFileSync(file, currentIndex.toString(), "utf-8");
        console.log(`Current index saved: ${currentIndex}`);
      } catch (err) {
        console.error("Error saving the index to file:", err.message);
      }

      // Increment the index
      currentIndex += 1;

      // Fetch the image
      const response = await axios({
        url: memes[currentIndex],
        method: "GET",
        responseType: "arraybuffer", // Fetch the image as binary data
      });

      // Convert the binary data to a buffer
      const buffer = Buffer.from(response.data, "binary");

      // Send the image to the specified Discord channel

      // Send a message to the channel if found
      if (channel) {
        try {
          await channel.send({
            files: [{ attachment: buffer, name: "image.jpg" }], // Replace with the desired file name
          });
        } catch (err) {
          console.error("Error sending message to channel:", err.message);
        }
      } else {
        console.error("Channel not found!");
      }
    }, 30 * 60 * 1000); // Reminder every 10 seconds (for testing purposes)
  }
}

module.exports = new MemeController();
