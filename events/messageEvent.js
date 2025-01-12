const CommandsController = require("../Controllers/CommandsController");
const { emotions } = require("../data/emotions");
const { formatMessage } = require("../utils/dynamicMessage");

const messageEvent = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore bot messages
    console.log(message);
    const command = message.content.toLowerCase().trim();
    if (command.startsWith("/")) {
      let currentEvent = command.slice(1, message.content.length).trim();
      if (currentEvent.toLowerCase() == "spam") {
        this._handleSpamMessage();
      }
    }
    if (message.content.toLowerCase().startsWith("obu")) {
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
      return;
      //   await message.channel.send(formatMessage("Command not recognized."));
    }
  });
};

module.exports = messageEvent;
