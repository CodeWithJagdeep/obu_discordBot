const {
  ButtonBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { welcomeMessage } = require("../data/messages");
const { formatMessage } = require("../utils/dynamicMessage");
const WelcomeModel = require("../Models/WelcomeCommands");

const guildMemberAdd = (client) => {
  client.on("guildMemberAdd", async (member) => {
    console.log(`New member joined: ${member.user.tag}, ${member.guild.id}`); // Logs when a user joins (even after being kicked)
    const channelId = await WelcomeModel.findOne({
      guildId: member.guild.id,
      enabled: true,
    });
    if (channelId) {
      const welcomeChannel = member.guild.channels.cache.find(
        (channel) => channel.id === channelId.channelId
      );

      if (!welcomeChannel) return;
      try {
        const welcomeEmbed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("Welcome!")
          .setDescription(welcomeMessage(member))
          .setTimestamp()
          .setFooter({ text: `Joined at` });

        // Send the embed to the welcome channel
        welcomeChannel.send({
          content: `Hey, please welcome @${member.user.username} to the server! 🎉`,
          embeds: [welcomeEmbed],
        });
      } catch (err) {
        console.log(err);
        //   await message.channel.send(formatMessage("Command not recognized."));
      }
    }
  });
};

const handleWelcomeCommand = async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  const channel = interaction.options.getChannel("channel");

  if (subcommand === "enable") {
    const exists = await WelcomeModel.findOne({
      guildId: interaction.guildId,
    });
    if (exists && exists.enabled) {
      if (exists.channelId === channel.id) {
        return interaction.reply({
          content: "Welcome messages are already enabled.",
          ephemeral: true,
        });
      } else {
        await WelcomeModel.findOneAndUpdate(
          { guildId: interaction.guildId },
          { enabled: true, channelId: channel.id },
          { upsert: true, new: true }
        );
      }
    }
    await WelcomeModel.findOneAndUpdate(
      { guildId: interaction.guildId },
      { enabled: true, channelId: channel.id },
      { upsert: true, new: true }
    );
    return interaction.reply({
      content: `Welcome messages enabled in ${channel}.`,
      ephemeral: true,
    });
  }

  if (subcommand === "disable") {
    await WelcomeModel.findOneAndUpdate(
      { guildId: interaction.guildId },
      { enabled: false },
      { upsert: true, new: true }
    );
    return interaction.reply({
      content: "Welcome messages have been disabled.",
      ephemeral: true,
    });
  }
};

module.exports = { guildMemberAdd, handleWelcomeCommand };
