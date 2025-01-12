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

  _handleMeme() {
    MemeController.sendMeme(this.client);
  }

  async start() {
    this.client.login(process.env.BOT_TOKEN); // Ensure your token is set in the environment variables
    this.onReady();
    this.onJoinUser();
    this.manageCommand();
    // this._handleMeme();
    // this._handleDisBoard();
  }
}

// Instantiate and export the bot
module.exports = new MyBot();
