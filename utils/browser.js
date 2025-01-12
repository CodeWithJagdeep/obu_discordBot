  const puppeteer = require("puppeteer");
  const path = require("path");
  const { leaderBoardPage } = require("./LeaderBoard");

  const launchBrowser = async (isHeadless) => {
    try {
      // const extensionPath = path.resolve(__dirname, "../extension/ezyZip");

      // console.log("Extension path:", extensionPath);
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--disable-blink-features=AutomationControlled", // Avoid detection
          "--disable-extensions-file-access-check", // Bypass file access check
          // `--disable-extensions-except=${extensionPath}`,
          // `--load-extension=${extensionPath}`,
          "--no-sandbox", // Disable sandboxing for Linux
          "--disable-setuid-sandbox", // Avoid permission issues in Linux
          "--disable-dev-shm-usage", // Use /tmp for shared memory to avoid space issues
          "--start-maximized", // Open browser window maximized
        ],
      });

      let page = await browser.newPage();
      await page.setContent(
        leaderBoardPage([
          {
            name: "John Doe",
            avatar: "https://www.example.com/avatar1.jpg", // Replace with actual image URL
            streak: 15,
          },
          {
            name: "Jane Smith",
            avatar: "https://www.example.com/avatar2.jpg", // Replace with actual image URL
            streak: 12,
          },
        ])
      );
      await page.emulateMediaType("screen"); // Optional: Useful for rendering media like print or screen

      // Capture screenshot of the leaderboard div
      const leaderboardDiv = await page.$(".leaderboard"); // Get the leaderboard div element
      // Capture screenshot as a buffer
      const buffer = await leaderboardDiv.screenshot({ encoding: "base64" });
      // console.log(buffer);
      // Close the browser
      await browser.close();

      return buffer;
    } catch (error) {
      console.error("Error launching browser:");
      throw error;
    }
  };

  module.exports = { launchBrowser };
