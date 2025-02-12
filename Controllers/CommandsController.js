const { TENOR_GIF_TOKEN, GOOGLE_CLIENT_ID } = require("../config/env");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const {
  obuCommands,
  specialOcc,
  wishes,
  reflectedEmotion,
} = require("../data/emotions");

class CommandsController {
  constructor() {}

  async findReleventGif(action) {
    try {
      const request = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=anime+${action}&key=${TENOR_GIF_TOKEN}&client_key=${GOOGLE_CLIENT_ID}&limit=50`
      );

      // console.log(request);
      let randomGif = Math.floor(Math.random() * request.data.results.length);
      let gifUrl = request.data.results[randomGif].media_formats.gif.url;

      if (gifUrl) {
        return gifUrl;
      }

      return { hasActionKey: true };
    } catch (err) {
      console.log(err);
    }
  }

  async sendGif(message, hasActionKey) {
    let gif = await this.findReleventGif(hasActionKey);
    if (gif) {
      try {
        let userId;

        // Get mentioned user IDs
        const mentionId = message.mentions.users.map((user) => user.id);

        // Prioritize mentions, then replied users, then fallback to author
        if (mentionId.length > 0) {
          userId = mentionId[0];
        } else if (message.mentions.repliedUser) {
          userId = message.mentions.repliedUser.id;
        } else {
          userId = message.author.id;
        }

        console.log(userId);

        // Fetch the author's server nickname or username
        const authorMember = await message.guild.members.fetch(
          message.author.id
        );
        const authorName = authorMember.nickname || authorMember.user.username;

        // Get the user's profile picture
        const avatarUrl = authorMember.user.displayAvatarURL({
          dynamic: true,
          size: 16,
        });

        // console.log(message);
        console.log(authorName);

        let dynamicMessage =
          reflectedEmotion(authorName, hasActionKey) ||
          `${authorName} wants to ${hasActionKey} you`;

        // Create the Embed
        const messageEmbed = new EmbedBuilder()
          .setColor(0x00ff00)
          // .setThumbnail(avatarUrl) // Add the user's profile picture // Green color
          .setTitle(`[👤](${avatarUrl})  **${dynamicMessage}**`) // Makes the text bold
          .setImage(gif); // Display the gif as the main image

        // Send the embed message

        // Send the embed as a reply to the message
        await message.channel.send({ embeds: [messageEmbed] });
      } catch (err) {
        console.log(err);
        return message.reply(
          "An error occurred while processing your request."
        );
      }
    }
  }

  async obuCommands(message) {
    // Determine the user ID correctly
    let userId = message.author ? message.author.id : message.user?.id;

    const commandEmbed = new EmbedBuilder()
      .setColor(0x00ff00) // Green color
      .setTitle("Emotions Commands List")
      .setDescription(obuCommands) // Insert the emotions message here
      .setTimestamp()
      .setFooter({ text: "Explore all available emotions!" });

    // Send the embed to the welcome channel
    message.reply({
      content: `Here's list of obu commands <@${userId}>`,
      embeds: [commandEmbed],
    });
  }
  async _handleSpam(message) {
    // Check if the user has at least one of the required roles
    const userRoles = message.member.roles.cache.map((role) => role.name);

    const hasRequiredRole = userRoles.some((role) =>
      this.requiredRoles.includes(role)
    );

    // If the user does not have a required role, ignore further actions
    if (!hasRequiredRole) {
      return message
        .reply("User doesn't have the required roles")
        .then((removeElement) => {
          setTimeout(() => {
            removeElement.delete();
          }, 5000);
        });
    }
    if (!message.reference) {
      return this.message.reply(
        "You need to reply to a message for me to delete it!"
      );
    }
    try {
      const messageReference = await message.channel.messages.fetch(
        this.message.reference.messageId
      );
      messageReference.delete();
      message.reply("Thank for reporting").then((removeElement) => {
        setTimeout(() => {
          removeElement.delete();
        }, 5000);
      });
    } catch (error) {
      message.channel.send(formatMessage("Command not recognized."));
    }
  }
}

module.exports = new CommandsController();
