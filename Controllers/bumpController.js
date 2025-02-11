const bumpModel = require("../Models/BumpModel");

class bumpController {
  constructor(intraction) {}
  async setBump(interaction) {
    // console.log(interaction);
    const guildId = interaction.guildId;
    const channelId = interaction.channelId;

    const hasValue = await bumpModel.findOne({
      guildId: guildId,
      ChannelId: channelId,
    });
    if (hasValue) {
      return await interaction.reply({
        content: "Done",
        ephemeral: true, // Only visible to the user who triggered it
      });
    }

    await bumpModel.create({ guildId: guildId, ChannelId: channelId });

    return await interaction.reply({
      content: "Done",
      ephemeral: true, // Only visible to the user who triggered it
    });
  }
}

module.exports = new bumpController();
