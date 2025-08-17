const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

const CommandsController = require("../Controllers/CommandsController");
const Game = require("../Controllers/GameController");
const { emotions } = require("../data/emotions");
const UserActivity = require("../Models/UserActivity");
const { resolveGame } = require("./GameEvents");
const RpsModel = require("../Models/RpsModel");
const {
  generateLeaderboardRps,
  generateLeaderboardImage,
} = require("../utils/CanvaGenerator");
const CountModel = require("../Models/EmotionsCount");
const FireFlyController = require("../Controllers/FireFlyController");

// ---------- RPS helpers (ADD) ----------
const RPS = ["rock", "paper", "scissors"];
const EMOJI = { rock: "🪨", paper: "📄", scissors: "✂️" };
const pickBotMove = () => RPS[Math.floor(Math.random() * RPS.length)];
const judge = (a, b) => {
  if (a === b) return "draw";
  return (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
    ? "a"
    : "b";
};

async function resolveSolo(message, playerId, playerMove, botMove) {
  const result = judge(playerMove, botMove);
  const embed = new EmbedBuilder()
    .setColor(0x00bfff)
    .setTitle("✊📄✂️ Rock, Paper, Scissors — You vs Bot")
    .setDescription(
      [
        `**You** chose ${EMOJI[playerMove]} **${playerMove}**`,
        `**Bot** chose ${EMOJI[botMove]} **${botMove}**`,
        "",
        result === "draw"
          ? "🤝 It's a **draw**!"
          : result === "a"
          ? "🏆 **You win!**"
          : "😵 **Bot wins!**",
      ].join("\n")
    );

  await message.channel.send({ embeds: [embed] });
}
const messageEvent = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const command = message.content.toLowerCase().trim();
    if (message.content.toLowerCase().startsWith("f")) {
      let hasActionKey = emotions.filter((state) =>
        message.content.toLowerCase().includes(state)
      )[0];

      if (message.content.toLowerCase().includes("commands")) {
        CommandsController.obuCommands(message);
      } else if (
        message.content.toLowerCase().includes("rps") &&
        message.content.toLowerCase().includes("lb")
      ) {
        const gameData = await RpsModel.find({
          guildId: message.guild.id,
          challengerId: message.author.id,
        }).sort({ playedAt: -1 });

        if (gameData.length) {
          const leaderboard = await generateLeaderboardRps(
            gameData.slice(0, 5)
          );

          return await message.reply({ content: leaderboard });
        } else {
          return await message.reply({ content: `No previous game found.` });
        }
      } else if (message.content.split(" ")[1] === "help") {
        CommandsController.obuCommands(message);
      } else if (message.content.split(" ")[1] === "rps") {
        let mentionId = message.mentions.users.map((user) => user.id);

        if (mentionId.length > 0) {
          mentionId = mentionId[0];
        } else if (message.mentions.repliedUser) {
          mentionId = message.mentions.repliedUser.id;
        } else {
          mentionId = "";
        }

        // SOLO MODE (no mention): user vs Bot
        if (!mentionId) {
          const soloRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`rps_solo_rock_${message.author.id}`)
              .setLabel("Rock")
              .setEmoji("🪨")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`rps_solo_paper_${message.author.id}`)
              .setLabel("Paper")
              .setEmoji("📄")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`rps_solo_scissors_${message.author.id}`)
              .setLabel("Scissors")
              .setEmoji("✂️")
              .setStyle(ButtonStyle.Primary)
          );

          const promptMsg = await message.channel.send({
            content: `🎮 <@${message.author.id}>, pick your move to challenge **Bot**!`,
            components: [soloRow],
          });

          const collector = message.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000, // 30s
          });

          let chosen = false;

          collector.on("collect", async (interaction) => {
            const parts = interaction.customId.split("_"); // rps_solo_move_userId
            if (parts[0] !== "rps" || parts[1] !== "solo") return;

            const move = parts[2];
            const targetUserId = parts[3];

            if (interaction.user.id !== message.author.id) {
              return interaction.reply({
                content: "Not your game!",
                ephemeral: true,
              });
            }
            if (interaction.user.id !== targetUserId) {
              return interaction.reply({
                content: "Invalid session.",
                ephemeral: true,
              });
            }
            if (chosen) {
              return interaction.reply({
                content: "You already chose!",
                ephemeral: true,
              });
            }

            chosen = true;
            await interaction.reply({
              content: `You chose **${move}** ${EMOJI[move]}!`,
              ephemeral: true,
            });
            collector.stop();

            // Disable buttons after selection (polish)
            try {
              await promptMsg.edit({ components: [] });
            } catch {}

            const botMove = pickBotMove();
            await resolveSolo(message, message.author.id, move, botMove);
          });

          collector.on("end", async () => {
            if (!chosen) {
              try {
                await promptMsg.edit({ components: [] });
              } catch {}
              await message.channel.send(
                "⌛ Game cancelled — no move selected in time."
              );
            }
          });

          return; // stop here in solo mode
        }

        await message.channel.send(
          `<@${message.author.id}> challenged <@${mentionId}> to a game of Rock, Paper, Scissors!`
        );

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`rps_rock_${message.author.id}`)
            .setLabel("Rock")
            .setEmoji("🪨")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`rps_paper_${message.author.id}`)
            .setLabel("Paper")
            .setEmoji("📄")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`rps_scissors_${message.author.id}`)
            .setLabel("Scissors")
            .setEmoji("✂️")
            .setStyle(ButtonStyle.Primary)
        );

        const opponentrow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`rps_rock_${mentionId}`)
            .setLabel("Rock")
            .setEmoji("🪨")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`rps_paper_${mentionId}`)
            .setLabel("Paper")
            .setEmoji("📄")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`rps_scissors_${mentionId}`)
            .setLabel("Scissors")
            .setEmoji("✂️")
            .setStyle(ButtonStyle.Primary)
        );

        const challengerMessage = await message.channel.send({
          content: `<@${message.author.id}>, choose your move!`,
          components: [row],
        });

        const opponentMessage = await message.channel.send({
          content: `<@${mentionId}>, choose your move!`,
          components: [opponentrow],
        });

        const collector = message.channel.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 30000, // 30 seconds
        });

        const moves = {};

        collector.on("collect", async (interaction) => {
          if (
            interaction.user.id !== message.author.id &&
            interaction.user.id !== mentionId
          ) {
            return await interaction.reply({
              content: "This isn't your game!",
              ephemeral: true,
            });
          }

          const [_, move, playerId] = interaction.customId.split("_");

          if (moves[interaction.user.id]) {
            return await interaction.reply({
              content: "You've already chosen!",
              ephemeral: true,
            });
          }

          moves[interaction.user.id] = move;
          await interaction.reply({
            content: `You chose **${move}**!`,
            ephemeral: true,
          });

          if (moves[message.author.id] && moves[mentionId]) {
            collector.stop();
            await resolveGame(message, message.author.id, mentionId, moves);
          }
        });

        collector.on("end", async () => {
          if (!moves[message.author.id] || !moves[mentionId]) {
            await message.channel.send(
              "Game cancelled — one or both players didn't choose in time."
            );
          }
        });
      } else if (message.content.toLowerCase().includes("lb") && hasActionKey) {
        const actionData = await CountModel.find({
          userId: message.author.id,
        }).sort({ count: -1 });

        const leaderboard = await generateLeaderboardImage(
          actionData.slice(0, 5),
          hasActionKey
        );

        return await message.reply({ content: leaderboard });
      } else if (message.content.split(" ")[1] === "firefly") {
        console.log("gere");
        return FireFlyController.startGame(message, message.author.id);
      } else if (message.content.toLowerCase().includes("yn")) {
        let question = message.content.split("yn")[1].trim();
        if (!question) {
          message.reply("Please provide a question after `yn`.");
          return;
        }
        if (!question) {
          return message.reply("You need to ask a proper yes/no question!");
        }

        // Randomly pick YES or NO (represented as letter arrays)
        const responses = [
          ["🇾", "🇪", "🇸"], // YES
          ["🇳", "🇴"], // NO
        ];

        const chosenResponse =
          responses[Math.floor(Math.random() * responses.length)];

        // Delete the user's message
        await message.delete();

        // Send the bot's reply message with the question
        const reply = await message.channel.send(
          `🔮 ${message.author} asked: **_\n*${question}*\n\n*`
        );

        // React with each letter of the chosen response (Y-E-S or N-O)
        for (const letter of chosenResponse) {
          await reply.react(letter);
        }
      } else if (hasActionKey) {
        CommandsController.sendGif(message, hasActionKey);
      }
    } else if (command.toLowerCase() == "spam") {
      CommandsController._handleSpam(message);
    } else if (command.toLowerCase().startsWith("!startdiary")) {
      const userIds = Array.from(message.mentions.users.keys());
      new Game(userIds, message, client).startGame();
      return;
    } else if (command.toLowerCase().startsWith("!help")) {
      CommandsController.obuCommands(message);
    } else {
      // Find the user in the database by guildId and userId
      const user = await UserActivity.findOne({
        guildId: message.guild.id,
        userId: message.author.id,
      });

      if (user) {
        // If the user exists, increment the points
        user.points += 1;
        await user.save();
      } else {
        // If the user does not exist, create a new record
        await UserActivity.create({
          guildId: message.guild.id,
          userId: message.author.id,
          username: message.author.username,
          points: 1, // Start with 1 point
        });
      }
    }
  });
};

module.exports = messageEvent;
