const {
  REST,
  SlashCommandBuilder,
  PermissionsBitField,
  Routes,
} = require("discord.js");
const { BOT_CLIENT_ID, BOT_TOKEN } = require("../config/env");
const { handleWelcomeCommand } = require("./guildMemberAdd");

class CommandsBuilder {
  constructor(client) {
    this.client = client;

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

      // Leaderboard command
      new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View respect and RPS leaderboard"),

      new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Song name or URL")
            .setRequired(true)
        ),
      new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the music"),
    ].map((command) => command.toJSON()); // Convert commands to JSON format
  }

  /**
   * Handles interactions when a user triggers a slash command.
   */
  async createInteraction() {
    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

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
        console.log(`Commands registered for guild: ${guildId}`);
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
