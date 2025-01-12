const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
  ButtonStyle,
} = require("discord.js");
const puppeteer = require("puppeteer");
const { emotions } = require("./data/emotion");
const axios = require("axios");
const { dynamicMessage } = require("./utils/dyamicMessage");
const path = require("path");
const fs = require("fs");
const nodeHtmlToImage = require("node-html-to-image");
const { leaderBoardPage, topUsers } = require("./utils/LeaderBoard");
const { launchBrowser } = require("./utils/browser");
const { createStreak, getStreak } = require("./Controller/StreakController");
const { memes } = require("./data/meme");

require("dotenv").config(); // Use environment variables for your token

class MyBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers, // This is required for guildMemberAdd
      ],
    });
    // Check if the user has the required roles (Admin, Staff, or Member)
    this.requiredRoles = ["Admin", "Staff", "Member"];
    this.message = null;
  }

  _dynamicMessage(action) {
    let msg = dynamicMessage[action];
    return msg;
  }

  async findReleventGif(action) {
    try {
      const request = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${action}&key=AIzaSyC_Js60FnNpi6rIa3Z6LzUZ81rV2R2kKe4 &client_key=900989774044-brd69nitvr4d74rbkls80ksavke83cie.apps.googleusercontent.com&limit=50`
      );

      let randomGif = Math.floor(Math.random() * request.data.results.length);
      let gifUrl = request.data.results[randomGif].media_formats.gif.url;

      if (gifUrl) {
        return gifUrl;
      }

      return { hasActionKey: true };
    } catch (err) {}
  }

  async _handleSpamMessage() {
    // Check if the user has at least one of the required roles
    const userRoles = this.message.member.roles.cache.map((role) => role.name);

    const hasRequiredRole = userRoles.some((role) =>
      this.requiredRoles.includes(role)
    );

    // If the user does not have a required role, ignore further actions
    if (!hasRequiredRole) {
      return this.message
        .reply("User doesn't have the required roles")
        .then((removeElement) => {
          setTimeout(() => {
            removeElement.delete();
          }, 5000);
        });
    }
    if (!this.message.reference) {
      return this.message.reply(
        "You need to reply to a message for me to delete it!"
      );
    }
    try {
      const messageReference = await this.message.channel.messages.fetch(
        this.message.reference.messageId
      );
      messageReference.delete();
      this.message.reply("Thank for reporting").then((removeElement) => {
        setTimeout(() => {
          removeElement.delete();
        }, 5000);
      });
    } catch (error) {}
  }

  async manageCommand() {
    this.client.on("messageCreate", async (message) => {
      // console.log(message);

      this.message = message;
      if (message.content.startsWith("/")) {
        let command = message.content.slice(1, message.content.length).trim();
        if (command.toLowerCase() == "spam") {
          this._handleSpamMessage();
        }
      }

      if (message.content.toLowerCase().startsWith("obu")) {
        let hasActionKey = emotions.filter(
          (state) => message.content.toLowerCase().includes(state) // Return true if message contains the state
        )[0];

        if (hasActionKey) {
          // Fetch the relevant GIF based on the action key
          let gif = await this.findReleventGif(hasActionKey);

          if (gif) {
            try {
              // // Extract userId and friendId from the message
              // const userId = message.author.id;
              // const friendIdMatch = message.content.match(/<@(\d+)>/);
              // const friendId = friendIdMatch ? friendIdMatch[1] : null; // Get friendId if it exists

              // if (!friendId) {
              //   return message.reply("Please mention a user to interact with.");
              // }

              // // Create the streak for the given user and friend
              // const streak = await createStreak({ userId, friendId });

              // // Ensure streak creation returns a valid object with streak and streakAdd properties
              // if (!streak) {
              //   return message.reply(
              //     "An error occurred while creating the streak."
              //   );
              // }

              // // const messageReference =
              // //   await this.message.channel.messages.fetch(this.message.id);
              // // messageReference.delete();

              // Make sure the action key is defined, e.g., 'slap', 'hug', etc.
              const actionKey = hasActionKey || "action"; // Replace with actual action key logic

              const title = `<@${message.author.id}> wants to ${actionKey} <@${friendId}>!`;
              // const title =
              //   userId && friendId
              //     ? `${
              //         streak.streakAdd
              //           ? `You made a total of ${streak.streaks} streak 🔥`
              //           : `<@${message.author.id}> wants to ${actionKey} <@${friendId}>!`
              //       }`
              //     : "Action failed due to missing information";

              // Create the Embed
              const messageEmbed = new EmbedBuilder()
                .setColor(0x00ff00) // Green color
                .setDescription(title) // Set the title with dynamic action
                .setImage(gif) // Display the gif as the main image
                .setTimestamp();

              // Send the embed as a reply to the message
              await message.channel.send({ embeds: [messageEmbed] });
            } catch (err) {
              console.log(err);
              return message.reply(
                "An error occurred while processing your request."
              );
            }
          } else {
            return message.reply("No GIF found for the action.");
          }
        } else if (message.content.toLowerCase().includes("commands")) {
          // Categorized emotions as a message to be sent to the channel
          const emotionsMessage = `
              **🔹 Emotions Commands List:**

              **💪 Physical Actions:**
              ${emotions.slice(0, 21).join(" | ")}

              **😃 Reactions/Expressions:**
              ${emotions.slice(21, 42).join(" | ")}

              **🔥 Intense/Funny Actions:**
              ${emotions.slice(42, 63).join(" | ")}

              **🐾 Cute/Friendly Actions:**
              ${emotions.slice(63, 74).join(" | ")}

              **🎉 Miscellaneous:**
              ${emotions.slice(74, 94).join(" | ")}

              **❤️ Love/Kiss Actions:**
              ${emotions.slice(94).join(" | ")}
              `;

          let channel = this.message.guild.channels.cache.find(
            (channel) => channel.name == "🤖︱bot-command"
          );

          // Creating the Embed
          const commandEmbed = new EmbedBuilder()
            .setColor(0x00ff00) // Green color
            .setTitle("Emotions Commands List")
            .setDescription(emotionsMessage) // Insert the emotions message here
            .setTimestamp()
            .setFooter({ text: "Explore all available emotions!" });

          // Send the embed to the welcome channel
          channel.send({
            content: `Here's list of obu commands <@${message.author.id}>`,
            embeds: [commandEmbed],
          });
        } else if (message.content.toLowerCase().includes("leaderboard")) {
          const TopStreak = await getStreak(message.author.id);
          console.log(TopStreak);
          // const leaderboardImage = await launchBrowser();
          // // console.log("Leaderboard image buffer generated");
          // // Convert Base64 string to buffer
          // const buffer = Buffer.from(leaderboardImage, "base64");
          // const messageReference = await message.channel.messages.fetch(
          //   message.id
          // );
          // // // console.log(messageReference);
          // await messageReference.delete();
          // // Send the image in the channel
          // await message.channel.send({
          //   files: [
          //     {
          //       attachment: buffer,
          //       name: "image.png", // You can set the file extension based on your image type
          //     },
          //   ],
          // });
        }
      } else {
        // // Fetch the user from the guild (server)
        // const user = await message.guild.members.fetch(this.message.author.id);
        // console.log(user);
      }

      // console.log(has)
    });
  }

  onJoinUser() {
    this.client.on("guildMemberAdd", async (member) => {
      console.log(`New member joined: ${member.user.tag}`); // Logs when a user joins (even after being kicked)
      const channel = member.guild.channels.cache.find(
        (channel) => channel.name == "👋🏻・welcome"
      );

      if (!channel) return;
      // Create a unique welcome message with animated emoji
      const welcomeMessage = `
        **Welcome to the server, @${member.user.tag}!** 
        🎉✨ We're excited to have you here! 🎉✨

        Please take a moment to introduce yourself, and check out the rules and channels!
        Let’s get ready to have some fun together! 🚀🔥
        `;

      // Create an Embed for the message
      let gif = await this.findReleventGif("welcome");

      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Welcome!")
        .setDescription(welcomeMessage)
        .setImage(gif) // Display the gif as the main image
        .setTimestamp()
        .setFooter({ text: `Joined at` });

      // Create buttons
      const ruleButton = new ButtonBuilder()
        .setLabel("📚 Read Rules") // Adding the rule book emoji in the label
        .setStyle(ButtonStyle.Link) // Use Link style to redirect
        .setURL(
          "https://discord.com/channels/1326785072182857729/1326785072678043752"
        ); // Your rule book channel link

      const row = new ActionRowBuilder().addComponents(ruleButton);

      // Send the embed to the welcome channel
      channel.send({
        content: `Hey, please welcome @${member.user.username} to the server! 🎉`,
        embeds: [welcomeEmbed],
        components: [row], // Add buttons below the message
      });

      // Assign the "Novice" role to the user (if applicable)
      const noviceRole = member.guild.roles.cache.find(
        (role) => role.name === "Novice"
      );

      await member.roles.add(noviceRole);
      // Send a congratulatory message for the promotion
      const promotionChannel = member.guild.channels.cache.find(
        (ch) => ch.name === "📢・ᴘʀᴏᴍᴏᴛɪᴏɴ"
      );
      // Fetch a relevant GIF (adjust the logic for `findReleventGif`)
      gif = await this.findReleventGif("promotion"); // Ensure `findReleventGif` returns a valid GIF URL.

      // Create an Embed for the promotion message
      const promoteEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("🎉 Promotion Alert! 🎉")
        .setDescription(
          `🥳 Congratulations, <@${member.user.id}>! You have been promoted to **Novice**! 🎊`
        )
        .setImage(gif) // Add the GIF as the embed's main image
        .setTimestamp()
        .setFooter({ text: "Keep up the great work!" });

      // Send the message in the promotion channel
      await promotionChannel.send({
        content: `🎉 Let's celebrate <@${member.user.id}>'s promotion!`,
        embeds: [promoteEmbed],
      });

      console.log(`Promotion message sent for ${member.user.tag}`);
    });
  }
  async onReady() {
    this.client.once("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`);
      this._handleDisBoard();
    });
  }
  async _handleDisBoard() {
    // Set an interval for periodic reminder (24 hours = 86400000 ms)
    setInterval(async () => {
      const channel = client.channels.cache.find(
        (ch) => ch.name === "🌐-·-ᴅɪꜱʙᴏᴀʀᴅ"
      );

      // If the channel exists, send a reminder
      if (channel) {
        await channel.send(
          `🚨 **Reminder**: It's time to use the /bump command to keep the server active! 🚨`
        );
      }
    }, 86400000); // Reminder every 24 hours
  }

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
  async sendMeme() {
    let currentIndex = 1; // Default starting index if the file doesn't exist
    const file = path.join(__dirname, "memeIndex.txt"); // Path to the file
    // Load the index from
    // the file when the script starts
    currentIndex = this.loadCurrentIndex(file);

    // Set an interval for periodic reminders
    setInterval(async () => {
      const channel = this.client.channels.cache.find(
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

  async start() {
    this.client.login(process.env.BOT_TOKEN); // Ensure your token is set in the environment variables
    await this.onReady();
    this.onJoinUser();
    this.manageCommand();
    this.sendMeme();
    // this._handleDisBoard();
  }
}

// Instantiate and export the bot
module.exports = new MyBot();
