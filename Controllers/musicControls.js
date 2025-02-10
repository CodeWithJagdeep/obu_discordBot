const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

/**
 * Function to create music control buttons
 */
function createMusicControls() {
  // First row of buttons (5 buttons max per row)
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("⏸ Pause")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("▶ Resume")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("⏭ Skip")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("⏹ Stop")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("queue")
      .setLabel("📜 Queue")
      .setStyle(ButtonStyle.Secondary)
  );

  // Second row of buttons (additional controls)
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("autoplay")
      .setLabel("🔁 Autoplay")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("clearqueue")
      .setLabel("🧹 Clear Queue")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("shuffle")
      .setLabel("🔀 Shuffle")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("loop")
      .setLabel("🔂 Loop")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("lyrics")
      .setLabel("📝 Lyrics")
      .setStyle(ButtonStyle.Secondary)
  );

  // Return both rows as an array
  return [row1, row2];
}

module.exports = { createMusicControls };
