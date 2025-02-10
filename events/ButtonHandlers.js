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

    default:
      await interaction.reply("❌ Unknown button interaction!");
      break;
  }
};
