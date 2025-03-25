const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const { default: DisTube } = require("distube");

const messageEvent = require("../events/messageEvent");
const { guildMemberAdd } = require("../events/guildMemberAdd");
const { _handleKickedMember } = require("../events/userEvents");
const CommandsBuilder = require("../events/commandBuilder");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { default: SpotifyPlugin } = require("@distube/spotify");
const { YouTubePlugin, YouTubePlaylist } = require("@distube/youtube");
const { default: SoundCloudPlugin } = require("@distube/soundcloud");

class MyBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates, // Needed for music bot
      ],
    });

    this._distube = null; // Private placeholder
  }

  /**
   * Getter for DisTube instance
   */
  get distube() {
    if (!this._distube) {
      throw new Error("DisTube is not initialized yet.");
    }
    return this._distube;
  }

  /**
   * Logs a message when the bot is ready and initializes DisTube.
   */
  async onReady() {
    this.client.once("ready", () => {
      console.log(`✅ Logged in as ${this.client.user.tag}`);

      // ✅ Initialize DisTube after the bot is ready
      this._distube = new DisTube(this.client, {
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,

        plugins: [
          // new SpotifyPlugin(),
          new SoundCloudPlugin(),
          new YouTubePlugin(), // Ensure YouTube Plugin works
          // new YtDlpPlugin(),
        ], // Optional: Add Spotify support
      });

      console.log("🎵 DisTube initialized successfully.");
    });
  }

  /**
   * Prevents the bot from going idle by sending periodic requests.
   */
  async _dummyRequest() {
    setInterval(async () => {
      try {
        await axios.get("https://lazy-bot-jd5m.onrender.com");
        console.log("Sent dummy request to keep bot alive.");
      } catch (err) {
        console.log("");
        // console.error("Error in dummy request:", err);
      }
    }, 60 * 1000);
  }

  /**
   * Starts the bot by logging in and initializing events.
   */
  async start() {
    try {
      await this.client.login(process.env.BOT_TOKEN);
      this.onReady();

      // Wait until DisTube is initialized
      this.client.once("ready", async () => {
        try {
          // Pass bot instance with `distube`
          const commandsBuilder = new CommandsBuilder(
            this.client,
            this.distube
          );
          await commandsBuilder.run(); // Ensures commands register before proceeding

          // Register event handlers
          guildMemberAdd(this.client);
          messageEvent(this.client);
          _handleKickedMember(this.client);

          // this._dummyRequest();
        } catch (error) {
          console.error("❌ Error initializing bot events:", error);
        }
      });
    } catch (error) {
      console.error("❌ Error starting the bot:", error);
    }
  }
}

// Export the bot instance
const botInstance = new MyBot();
module.exports = botInstance;
