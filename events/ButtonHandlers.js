const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction, distube) => {
  if (!interaction.isButton()) return;

  const queue = distube.getQueue(interaction.guildId);
  const { customId } = interaction;

  switch (customId) {
    case "pause":
      if (!queue) return interaction.reply("❌ No song is playing!");
      if (queue.paused)
        return interaction.reply("⏸ The music is already paused!");
      queue.pause();
      await interaction.reply("⏸ Paused the music!");
      break;

    case "resume":
      if (!queue) return interaction.reply("❌ No song is playing!");
      if (!queue.paused)
        return interaction.reply("▶ The music is already playing!");
      queue.resume();
      await interaction.reply("▶ Resumed the music!");
      break;

    case "skip":
      await interaction.deferReply(); // Defer the reply to prevent timeout issues
      if (!queue) {
        return interaction.editReply("❌ No song is playing!");
      }

      if (queue.songs.length <= 1) {
        return interaction.editReply("❌ There are no more songs to skip!");
      }

      try {
        await queue.skip();
        await interaction.editReply("⏭ Skipped to the next song!");
      } catch (error) {
        console.error(error);
        await interaction.editReply("⚠️ Error skipping the song.");
      }
      break;

    case "stop":
      if (!queue) return interaction.reply("❌ No song is playing!");
      queue.stop();
      await interaction.reply("⏹ Stopped the music!");
      break;

    case "queue":
      if (!queue || !queue.songs.length)
        return interaction.reply("📜 Queue is empty.");
      const songs = queue.songs
        .map((song, i) => `${i + 1}. **${song.name}**`)
        .join("\n");
      await interaction.reply(`📜 **Current Queue:**\n${songs}`);
      break;
    case "how_to_play":
      await interaction.deferReply({ ephemeral: true }); // Defers the reply
      try {
        const embed = new EmbedBuilder()
          .setColor("#0099ff") // Stylish Blue Color
          .setTitle("🎮 How to Play?")
          .setDescription(
            "Welcome to **Shadow Tactics**, an exciting game where strategy, quick thinking, and teamwork are key! 🚀\n\n" +
              "**🔹 About the Game:**\n" +
              "In this game, players engage in a thrilling battle of wit and reflexes. You must complete objectives, make strategic moves, and outsmart your opponents to win!\n\n" +
              "**📌 How to Play:**\n" +
              "1️⃣ **Type `/start`** to begin your journey.\n" +
              "2️⃣ **Each player gets a turn** to use one of the two commands:\n" +
              "   - 🗣️ **`/lasttell`** → Ask about the last statement made by another player.\n" +
              "   - 🎭 **`/tho`** → add your statement to continue game\n" +
              "4️⃣ **Compete or collaborate** to achieve victory.\n\n" +
              "**🔥 Pro Tip:** Stay alert, think ahead, and use teamwork to dominate the game!"
          )
          .setFooter({
            text: "Good luck, and may the best player win! 🎯",
            iconURL: interaction.user.displayAvatarURL(),
          });

        return await interaction.editReply({ embeds: [embed] }); // Sends the embed after defer
      } catch (err) {
        return await interaction.reply({
          content: "unknown error",
          ephemeral: true, // Only visible to the user who clicked
        });
      }
      break;
    default:
      return await interaction.reply("❌ Unknown button interaction!");
      break;
  }
};
