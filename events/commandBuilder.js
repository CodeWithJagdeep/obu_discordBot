const {
  REST,
  SlashCommandBuilder,
  PermissionsBitField,
  Routes,
  EmbedBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Collection,
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
const CommandsController = require("../Controllers/CommandsController");
const { emotions } = require("../data/emotions");
const CountModel = require("../Models/EmotionsCount");
const { generateLeaderboardImage } = require("../utils/CanvaGenerator");

class CommandsBuilder {
  constructor(client, distube) {
    this.client = client;
    this.distube = distube;
    // Define the bot's slash commands
    this.commands = [
      // Pay respect command
      new SlashCommandBuilder()
        .setName("respect")
        .setDescription("Pay respect to another user"),

      new SlashCommandBuilder()
        .setName("lb")
        .setDescription("Tracks user interactions (e.g., hugs, kisses, wins)")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription(" Shows leaderboard for specific action")
            .setRequired(true)
        ),

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
        .setName("help")
        .setDescription("obu, do you need any help?"),

      new SlashCommandBuilder()
        .setName("lasttell")
        .setDescription("show you last submission"),

      new SlashCommandBuilder()
        .setName("firefly")
        .setDescription("Catch the firefly!"),
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
          case "lb":
            const actionQuery = interaction.options.getString("action");
            let hasActionKey = emotions.includes(actionQuery);
            if (hasActionKey) {
              const actionData = await CountModel.find({}).sort({ count: -1 });
              const leaderboardImage = await generateLeaderboardImage(
                actionData.slice(0, 5),
                actionQuery
              );

              await interaction.reply({ content: leaderboardImage });
            }
            break;

          case "firefly":
            const fireflyEmoji = "🪰";
            const emptyEmoji = "⬛";

            // Cooldown map
            const fireflyCooldowns = new Collection();
            const cooldownTime = 4 * 60 * 1000; // 4 minutes cooldown

            const userId = interaction.user.id;
            const now = Date.now();

            // Check cooldown
            if (fireflyCooldowns.has(userId)) {
              const expirationTime =
                fireflyCooldowns.get(userId) + cooldownTime;
              if (now < expirationTime) {
                const timeLeft = Math.ceil((expirationTime - now) / 1000);
                return interaction.reply({
                  content: `⏳ Please wait **${timeLeft} seconds** before catching fireflies again!`,
                  ephemeral: true,
                });
              }
            }

            // Set new cooldown
            fireflyCooldowns.set(userId, now);

            let fireflyPosition = Math.floor(Math.random() * 9);

            function createButtons() {
              return Array.from({ length: 9 }, (_, i) =>
                new ButtonBuilder()
                  .setCustomId(`firefly_${i}`)
                  .setEmoji(i === fireflyPosition ? fireflyEmoji : emptyEmoji)
                  .setStyle(ButtonStyle.Secondary)
              );
            }

            const embed = new EmbedBuilder()
              .setTitle("Catch the Firefly!")
              .setDescription(
                "Click the button where you think the firefly is hiding!"
              )
              .setColor(0xffd700);

            const rows = [
              new ActionRowBuilder().addComponents(createButtons().slice(0, 3)),
              new ActionRowBuilder().addComponents(createButtons().slice(3, 6)),
              new ActionRowBuilder().addComponents(createButtons().slice(6, 9)),
            ];

            const reply = await interaction.reply({
              embeds: [embed],
              components: rows,
              fetchReply: true,
            });

            const filter = (btnInteraction) =>
              btnInteraction.user.id === interaction.user.id;

            const collector = reply.createMessageComponentCollector({
              filter,
              time: 2 * 60 * 1000,
            }); // 2 minutes max game time

            let caught = false;

            // Firefly moves every 1.5 seconds
            const movementInterval = setInterval(async () => {
              fireflyPosition = Math.floor(Math.random() * 9);
              console.log(fireflyPosition);
              const updatedRows = [
                new ActionRowBuilder().addComponents(
                  createButtons().slice(0, 3)
                ),
                new ActionRowBuilder().addComponents(
                  createButtons().slice(3, 6)
                ),
                new ActionRowBuilder().addComponents(
                  createButtons().slice(6, 9)
                ),
              ];

              await interaction.editReply({ components: updatedRows });
            }, 1500);

            collector.on("collect", async (btnInteraction) => {
              await btnInteraction.deferUpdate();
              collector.stop();

              clearInterval(movementInterval); // Stop movement once caught or missed
              console.log(btnInteraction.customId);
              if (btnInteraction.customId === `firefly_${fireflyPosition}`) {
                caught = true;

                const winEmbed = new EmbedBuilder()
                  .setTitle("You caught a Firefly!")
                  .setDescription("+1 🪰 firefly added to your collection.")
                  .setColor(0x00ff00);

                return await interaction.editReply({
                  embeds: [winEmbed],
                  components: [],
                });

                // Optional: Add database update logic here (increment firefly count).
              } else {
                const loseEmbed = new EmbedBuilder()
                  .setTitle("Missed!")
                  .setDescription(
                    "That was the wrong button. The firefly escaped."
                  )
                  .setColor(0xff0000);

                return await interaction.editReply({
                  embeds: [loseEmbed],
                  components: [],
                });
              }
            });

            collector.on("end", async () => {
              clearInterval(movementInterval); // Stop movement if time runs out

              if (!caught) {
                const timeoutEmbed = new EmbedBuilder()
                  .setTitle("Too Slow!")
                  .setDescription(
                    "You didn't react in time. The firefly flew away."
                  )
                  .setColor(0x7289da);

                return await interaction.editReply({
                  embeds: [timeoutEmbed],
                  components: [],
                });
              }
            });
            break;
          case "help":
            CommandsController.obuCommands(interaction);
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
