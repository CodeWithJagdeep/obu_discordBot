const {
  REST,
  SlashCommandBuilder,
  PermissionsBitField,
  Routes,
  EmbedBuilder,
} = require("discord.js");
const { BOT_CLIENT_ID, BOT_TOKEN } = require("../config/env");
const { handleWelcomeCommand } = require("./guildMemberAdd");
const GameModel = require("../Models/GameModel");
const play = require("play-dl");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ButtonHandlers = require("./ButtonHandlers");
const { createMusicControls } = require("../Controllers/musicControls");
const ytdl = require("@distube/ytdl-core");
const bumpController = require("../Controllers/bumpController");

class CommandsBuilder {
  constructor(client, distube) {
    this.client = client;
    this.distube = distube;
    // Define the bot's slash commands
    this.commands = [
      // Rock-Paper-Scissors game command
      new SlashCommandBuilder()
        .setName("flash")
        .setDescription("Play Rock-Paper-Scissors")
        .addUserOption((option) =>
          option
            .setName("opponent")
            .setDescription("User to challenge")
            .setRequired(false)
        ),

      // Welcome command with enable/disable options
      new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Enable or disable welcome messages")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("enable")
            .setDescription("Enable welcome messages")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Channel for welcome messages")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("disable")
            .setDescription("Disable welcome messages")
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator), // Restricts to admins

      // Pay respect command
      new SlashCommandBuilder()
        .setName("respect")
        .setDescription("Pay respect to another user"),

      new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View respect and RPS leaderboard"),

      new SlashCommandBuilder()
        .setName("tho")
        .setDescription("add something to this diary")
        .addStringOption((option) =>
          option
            .setName("thought")
            .setDescription("Write something in the diary")
            .setRequired(true)
        ),

      new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song or a YouTube playlist in a voice channel")
        .addStringOption((option) =>
          option
            .setName("query") // Changed from long text to a short name
            .setDescription("Enter a song name or YouTube playlist URL")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("setbump")
        .setDescription("Configure automatic server bumping."),

      new SlashCommandBuilder()
        .setName("lasttell")
        .setDescription("show you last submission"),
    ].map((command) => command.toJSON()); // Convert commands to JSON format
  }

  /**
   * Handles interactions when a user triggers a slash command.
   */
  async createInteraction() {
    this.client.on("interactionCreate", async (interaction) => {
      if (interaction.isButton())
        return await ButtonHandlers(interaction, this.distube);
      else if (!interaction.isCommand()) {
        return;
      } else {
        switch (interaction.commandName) {
          case "welcome":
            await handleWelcomeCommand(interaction); // Handles enabling/disabling welcome messages
            break;
          case "flash":
            await interaction.reply({
              content: "Starting Rock-Paper-Scissors game...",
              ephemeral: true, // Only visible to the user who triggered it
            });
            break;
          case "setbump":
            bumpController.setBump(interaction);
            break;
          case "lasttell": // Fix: Remove `/`
            const game = await GameModel.findOne({
              GameStatus: true,
              ChannelId: interaction.channelId,
            });
            if (game) {
              let currentUser = game.participants.filter(
                (state) => !state.submission
              )[0];
              let prevUser = currentUser.sequence - 1;
              if (currentUser.userId == interaction.user.id) {
                if (prevUser >= 0 && game.participants[prevUser]) {
                  return await interaction.reply({
                    content:
                      game.participants[prevUser].thought ||
                      "The last participant failed submit on time",
                    ephemeral: true, // Only visible to the user who triggered it
                  });
                } else {
                  return await interaction.reply({
                    content: "It might not be your turn.",
                    ephemeral: true,
                  });
                }
              } else {
                return await interaction.reply({
                  content: "Maybe it's not your turn",
                  ephemeral: true, // Only visible to the user who triggered it
                });
              }
            } else {
              return await interaction.reply({
                content:
                  "No game is currently running. Use `!startdiary` and tag a friend to start.",
                ephemeral: true, // Only visible to the user who triggered it
              });
            }

          case "tho":
            const existingGame = await GameModel.findOne({
              GameStatus: true,
              ChannelId: interaction.channelId,
            });
            if (existingGame) {
              let currentUser = existingGame.participants.find(
                (state) => state.userId == interaction.user.id
              );
              if (currentUser) {
                const thought = interaction.options.getString("thought"); // Fix: Use getString for string input
                currentUser.thought = thought;
                await existingGame.save();
                return await interaction.reply({
                  content: `<@${currentUser.userId}> has submitted their thought.`,
                });
              }
            } else {
              return await interaction.reply({
                content:
                  "No game running use !startdiary command and tag your friend to start.",
                ephemeral: true, // Only visible to the user who triggered it
              });
            }

          case "play":
            const query = interaction.options.getString("query");
            const voiceChannel = interaction.member.voice.channel;

            // Check if the user is in a voice channel
            if (!voiceChannel) {
              return interaction.reply({
                content:
                  "❌ You need to be in a voice channel to use this command!",
                ephemeral: true,
              });
            }

            // Check if the bot has permission to join and speak in the voice channel
            if (!voiceChannel.joinable || !voiceChannel.speakable) {
              return interaction.reply({
                content:
                  "❌ I don't have permission to join or speak in that voice channel!",
                ephemeral: true,
              });
            }

            try {
              // ✅ Defer reply to prevent "Unknown interaction" error
              await interaction.deferReply();
              // Play the song using DisTube
              await this.distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member,
              });
              const queue = this.distube.getQueue(voiceChannel);
              if (!queue)
                return interaction.editReply("⚠️ No song is playing.");

              const song = queue.songs[0]; // Get currently playing song
              const serverName = interaction.guild.name; // Get server name
              const serverIcon =
                interaction.guild.iconURL({ dynamic: true, size: 1024 }) ||
                "https://cdn.discordapp.com/embed/avatars/0.png"; // Get server icon

              // ✅ Create an embed response
              const embed = new EmbedBuilder()
                .setColor("#3498db") // Blue color
                .setTitle(`🎵 Now Playing in ${serverName}`)
                .setDescription(`**${song.name}** — ${song.uploader.name}`)
                .setThumbnail(song.thumbnail) // Song thumbnail
                .setAuthor({ name: serverName, iconURL: serverIcon }) // Server name & logo
                .addFields(
                  {
                    name: "⏳ Duration",
                    value: song.formattedDuration,
                    inline: true,
                  },
                  {
                    name: "📜 Queue",
                    value: `${queue.songs.length - 1}`,
                    inline: true,
                  },
                  {
                    name: "🔊 Volume",
                    value: `${queue.volume}%`,
                    inline: true,
                  },
                  {
                    name: "🙋 Requester",
                    value: `<@${interaction.user.id}>`,
                    inline: true,
                  }
                )
                .setTimestamp();

              // ✅ Send embed response
              await interaction.editReply({
                embeds: [embed],
                components: createMusicControls(),
              });
            } catch (error) {
              console.error(error);
              await interaction.editReply("⚠️ Error playing the song.");
            }
            break;
          default:
            await interaction.reply({
              content: "Unknown command!",
              ephemeral: true,
            });
        }
      }
    });
  }

  /**
   * Registers the bot's slash commands for all guilds (servers).
   */
  async registerCommands() {
    const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

    try {
      const guilds = await this.client.guilds.fetch(); // Fetches all servers the bot is in

      for (const [guildId] of guilds) {
        await rest.put(
          Routes.applicationGuildCommands(BOT_CLIENT_ID, guildId),
          { body: this.commands }
        );
      }

      console.log("Successfully registered all slash commands.");
    } catch (error) {
      console.error("Error registering commands:", error);
    }
  }

  /**
   * Initializes interaction handlers and registers commands.
   */
  async run() {
    this.createInteraction();
    await this.registerCommands(); // Ensures commands are registered before interaction handling starts
  }
}

module.exports = CommandsBuilder;
