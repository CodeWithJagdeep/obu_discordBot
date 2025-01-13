const {
  Client,
  GatewayIntentBits,

  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
  ButtonStyle,
} = require("discord.js");
const messageEvent = require("../events/messageEvent");
const { guildMemberAdd } = require("../events/guildMemberAdd");
const MemeController = require("../Controllers/MemeController");
const { memeEvents } = require("../events/memeEvent");
const axios = require("axios");

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

  async manageCommand() {
    messageEvent(this.client);
  }

  onJoinUser() {
    guildMemberAdd(this.client);
  }
  onReady() {
    this.client.once("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`);
    });
  }

  async _handleMeme() {
    try {
      const guild = await this.client.guilds.fetch("1326785072182857729"); // Fetch the guild

      // Fetch the channels after the guild is fetched
      await guild.channels.fetch();
      let channel = guild.channels.cache.find((ch) => ch.name == "😂・memes");
      memeEvents(channel);
      // Now you can access the channels cache
      // console.log();
    } catch (error) {
      console.error("Error fetching guild or channels:", error);
    }
  }

  async _dummyRequest() {
    setInterval(async () => {
      try {
        const request = await axios.get("https://obu-discordbot.onrender.com");
        // console.log("done");
      } catch (err) {
        // console.log("done", err);
      }
    }, 60 * 1000);
  }

  async start() {
    this.client.login(process.env.BOT_TOKEN); // Ensure your token is set in the environment variables
    this.onReady();
    this.onJoinUser();
    this.manageCommand();
    this._handleMeme();
    this._dummyRequest();
  }
}

// Instantiate and export the bot
module.exports = new MyBot();
