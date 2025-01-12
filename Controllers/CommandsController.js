const { TENOR_GIF_TOKEN, GOOGLE_CLIENT_ID } = require("../config/env");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const { obuCommands } = require("../data/emotions");

class CommandsController {
  constructor() {}

  async findReleventGif(action) {
    try {
      const request = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${action}&key=${TENOR_GIF_TOKEN}&client_key=${GOOGLE_CLIENT_ID}&limit=50`
      );

      console.log(request);
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
    console.log(gif);
    if (gif) {
      try {
        // // Extract userId and friendId from the message
        // const userId = message.author.id;
        // const friendIdMatch = message.content.match(/<@(\d+)>/);
        // const friendId = friendIdMatch ? friendIdMatch[1] : null; // Get friendId if it exists

        // if (!friendId) {
        //   return message.reply("Please mention a user to interact with.");
        // }

        // // Create the streak for the given user and friend
        // const streak = await createStreak({ userId, friendId });

        // // Ensure streak creation returns a valid object with streak and streakAdd properties
        // if (!streak) {
        //   return message.reply(
        //     "An error occurred while creating the streak."
        //   );
        // }

        // // const messageReference =
        // //   await this.message.channel.messages.fetch(this.message.id);
        // // messageReference.delete();

        // Make sure the action key is defined, e.g., 'slap', 'hug', etc.
        const actionKey = hasActionKey || "action"; // Replace with actual action key logic

        const title = `<@${message.author.id}> wants to ${actionKey} !`;
        // const title =
        //   userId && friendId
        //     ? `${
        //         streak.streakAdd
        //           ? `You made a total of ${streak.streaks} streak 🔥`
        //           : `<@${message.author.id}> wants to ${actionKey} <@${friendId}>!`
        //       }`
        //     : "Action failed due to missing information";

        // Create the Embed
        const messageEmbed = new EmbedBuilder()
          .setColor(0x00ff00) // Green color
          .setDescription(title) // Set the title with dynamic action
          .setImage(gif) // Display the gif as the main image
          .setTimestamp();

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
    // let channel = message.guild.channels.cache.find(
    //   (channel) => channel.name == "🤖︱bot-command"
    // );

    // Creating the Embed
    const commandEmbed = new EmbedBuilder()
      .setColor(0x00ff00) // Green color
      .setTitle("Emotions Commands List")
      .setDescription(obuCommands) // Insert the emotions message here
      .setTimestamp()
      .setFooter({ text: "Explore all available emotions!" });

    // Send the embed to the welcome channel
    message.reply({
      content: `Here's list of obu commands <@${message.author.id}>`,
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
