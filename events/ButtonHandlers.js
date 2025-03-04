const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction, distube) => {
  if (!interaction.isButton()) return;

  const queue = distube.getQueue(interaction.guildId);
  const { customId } = interaction;

  console.log(customId);

  if (customId === "pause") {
    if (!queue) return await interaction.reply("❌ No song is playing!");
    if (queue.paused)
      return await interaction.reply("⏸ The music is already paused!");
    queue.pause();
    return await interaction.reply("⏸ Paused the music!");
  } else if (customId === "resume") {
    if (!queue) return await interaction.reply("❌ No song is playing!");
    if (!queue.paused)
      return await interaction.reply("▶ The music is already playing!");
    queue.resume();
    return await interaction.reply("▶ Resumed the music!");
  } else if (customId === "skip") {
    await interaction.deferReply();
    if (!queue) return await interaction.editReply("❌ No song is playing!");
    if (queue.songs.length <= 1)
      return await interaction.editReply("❌ There are no more songs to skip!");
    try {
      await queue.skip();
      return await interaction.editReply("⏭ Skipped to the next song!");
    } catch (error) {
      console.error(error);
      return await interaction.editReply("⚠️ Error skipping the song.");
    }
  } else if (customId === "stop") {
    if (!queue) return await interaction.reply("❌ No song is playing!");
    queue.stop();
    return await interaction.reply("⏹ Stopped the music!");
  } else if (customId === "queue") {
    if (!queue || !queue.songs.length)
      return await interaction.reply("📜 Queue is empty.");
    const songs = queue.songs
      .map((song, i) => `${i + 1}. **${song.name}**`)
      .join("\n");
    return await interaction.reply(`📜 **Current Queue:**\n${songs}`);
  } else if (customId === "how_to_play") {
    await interaction.deferReply({ ephemeral: true });
    try {
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
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

      return await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      return await interaction.reply({
        content: "unknown error",
        ephemeral: true,
      });
    }
  }
};
