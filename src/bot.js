const { Client, GatewayIntentBits } = require("discord.js");
const messageEvent = require("../events/messageEvent");
const { guildMemberAdd } = require("../events/guildMemberAdd");
const { _handleKickedMember } = require("../events/userEvents");
const { RPSgame } = require("../events/GameEvents");
const axios = require("axios");
const CommandsBuilder = require("../events/commandBuilder");

class MyBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds, // Required to interact with guild-related events
        GatewayIntentBits.GuildMessages, // Allows bot to read and send messages
        GatewayIntentBits.MessageContent, // Enables message content reading
        GatewayIntentBits.GuildMembers, // Enables member join/leave event handling
      ],
    });
  }

  /**
   * Logs a message when the bot is ready.
   */
  onReady() {
    this.client.once("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`);
    });
  }

  /**
   * Prevents the bot from going idle by sending periodic requests.
   * This keeps the bot awake on free hosting platforms like Render.
   */
  async _dummyRequest() {
    setInterval(async () => {
      try {
        await axios.get("https://obu-discordbot.onrender.com");
        console.log("Sent dummy request to keep bot alive.");
      } catch (err) {
        console.error("Error in dummy request:", err);
      }
    }, 60 * 1000); // Every 60 seconds
  }

  /**
   * Starts the bot by logging in and initializing events.
   */
  async start() {
    await this.client.login(process.env.BOT_TOKEN);
    this.onReady();

    // Initialize commands
    const commandsBuilder = new CommandsBuilder(this.client);
    await commandsBuilder.run(); // Ensures commands register before proceeding
    this._dummyRequest();
    // Register event handlers
    guildMemberAdd(this.client); // Handles new member joins
    messageEvent(this.client); // Handles message-related events
    _handleKickedMember(this.client); // Handles member kick events
    RPSgame(this.client); // Starts Rock-Paper-Scissors game logic
  }
}

module.exports = new MyBot();
