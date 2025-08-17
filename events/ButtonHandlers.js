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
  } else if (customId === "Actions") {
    let updatedEmbed;
    updatedEmbed = new EmbedBuilder()
      .setColor(0x1abc9c) // A nice teal-green
      .setTitle("🎭 Action Commands")
      .setDescription(
        "✨ **Spice up your interactions with these fun commands!** ✨\n\n" +
          "🦷 **f bite** `<@user>` → Bite your target like a vampire! 🧛\n" +
          "🤗 **f hug** `<@user>` → Wrap someone in a warm hug! ❤️\n" +
          "🥾 **f kick** `<@user>` → Give your target a playful kick! 😆\n" +
          "⚔️ **f kill** `<@user>` → *Finish them…* 💀\n" +
          "💋 **f kiss** `<@user>` → Share a sweet kiss with someone special! 💞\n" +
          "👅 **f lick** `<@user>` → Lick your target (weird, but okay 🤨).\n" +
          "🍑 **f spank** `<@user>` → Spank someone for fun! 😉\n" +
          "👋 **f wave** `<@user>` → Wave and say hello! 🌊\n" +
          "🔪 **f stab** `<@user>` → Stab an innocent soul (ouch 😬).\n" +
          "🖐️ **f slap** `<@user>` → Smack someone right across the face! 😂"
      )
      .setFooter({ text: "Use wisely… or chaotically 😈" })
      .setThumbnail("https://i.imgur.com/6KJ1N4H.png"); // Optional fun icon

    return await interaction.update({ embeds: [updatedEmbed] });
  } else if (customId === "Games") {
    let updatedEmbed = new EmbedBuilder()
      .setColor(0x00bfff) // Bright Sky Blue
      .setTitle("🎮 Game Commands")
      .setDescription(
        "✨ **Level up your fun with these awesome games!** ✨\n\n" +
          "✊📄✂️ **/rps** → Challenge your friends in Rock, Paper, Scissors!\n" +
          "🪰✨ **/firefly** → Try to catch the glowing firefly before it escapes!\n" +
          "📖🎭 **/storytell** → A thrilling game of strategy, quick thinking, and teamwork!"
      )
      .setThumbnail("https://i.imgur.com/8Km9tLL.png") // Optional: fun game icon
      .setFooter({ text: "Play smart. Play fun. 🕹️" });

    return await interaction.update({ embeds: [updatedEmbed] });
  } else if (customId === "Fun") {
    let updatedEmbed = new EmbedBuilder()
      .setColor(0x8e44ad) // Purple color
      .setTitle("😂 Fun Commands")
      .setDescription(
        "**Get your fun dose with these commands!**\n\n" +
          "**yn** - Using AI and Machine Learning, a rational answer to the question is given.\n" +
          "**F** - Pay your respects to someone."
      );
    return await interaction.update({ embeds: [updatedEmbed] });
  }
};
