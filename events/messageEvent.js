const CommandsController = require("../Controllers/CommandsController");
const { emotions } = require("../data/emotions");
const UserActivity = require("../Models/UserActivity");
const { formatMessage } = require("../utils/dynamicMessage");

const messageEvent = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const command = message.content.toLowerCase().trim();
    if (message.content.toLowerCase().startsWith("f")) {
      let hasActionKey = emotions.filter(
        (state) => message.content.toLowerCase().includes(state) // Return true if message contains the state
      )[0];

      if (hasActionKey) {
        CommandsController.sendGif(message, hasActionKey);
      } else if (message.content.toLowerCase().includes("commands")) {
        CommandsController.obuCommands(message);
      }
    } else if (command.toLowerCase() == "spam") {
      CommandsController._handleSpam(message);
    } else {
      // Find the user in the database by guildId and userId
      const user = await UserActivity.findOne({
        guildId: message.guild.id,
        userId: message.author.id,
      });

      if (user) {
        // If the user exists, increment the points
        user.points += 1;
        await user.save();
        console.log(
          `Updated points for ${message.author.username}: ${user.points}`
        );
      } else {
        // If the user does not exist, create a new record
        await UserActivity.create({
          guildId: message.guild.id,
          userId: message.author.id,
          username: message.author.username,
          points: 1, // Start with 1 point
        });
        console.log(`Created new user record for ${message.author.username}`);
      }
    }
  });
};

module.exports = messageEvent;
