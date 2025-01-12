const {
  ButtonBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { welcomeMessage } = require("../data/messages");
const { formatMessage } = require("../utils/dynamicMessage");

const guildMemberAdd = (client) => {
  client.on("guildMemberAdd", async (member) => {
    console.log(`New member joined: ${member.user.tag}`); // Logs when a user joins (even after being kicked)
    const welcomeChannel = member.guild.channels.cache.find(
      (channel) => channel.name === "👋🏻・welcome"
    );
    const promotionChannel = member.guild.channels.cache.find(
      (ch) => ch.name === "📢・ᴘʀᴏᴍᴏᴛɪᴏɴ"
    );
    const noviceRole = member.guild.roles.cache.find(
      (role) => role.name === "Novice"
    );
    if (!welcomeChannel || !promotionChannel || !noviceRole) return;
    try {
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("Welcome!")
        .setDescription(welcomeMessage(member))
        .setTimestamp()
        .setFooter({ text: `Joined at` });
      // Create buttons
      const ruleButton = new ButtonBuilder()
        .setLabel("📚 Read Rules") // Adding the rule book emoji in the label
        .setStyle(ButtonStyle.Link) // Use Link style to redirect
        .setURL(
          "https://discord.com/channels/1326785072182857729/1326785072678043752"
        ); // Your rule book channel link
      const row = new ActionRowBuilder().addComponents(ruleButton);

      // Send the embed to the welcome channel
      welcomeChannel.send({
        content: `Hey, please welcome @${member.user.username} to the server! 🎉`,
        embeds: [welcomeEmbed],
        components: [row], // Add buttons below the message
      });
      await member.roles.add(noviceRole);
      // Create an Embed for the promotion message
      const promoteEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("🎉 Promotion Alert! 🎉")
        .setDescription(
          `🥳 Congratulations, <@${member.user.id}>! You have been promoted to **Novice**! 🎊`
        )

        .setTimestamp()
        .setFooter({ text: "Keep up the great work!" });

      // Send the message in the promotion channel
      await promotionChannel.send({
        content: `🎉 Let's celebrate <@${member.user.id}>'s promotion!`,
        embeds: [promoteEmbed],
      });
    } catch (err) {
      console.log(err);
      //   await message.channel.send(formatMessage("Command not recognized."));
    }
  });
};

module.exports = { guildMemberAdd };
