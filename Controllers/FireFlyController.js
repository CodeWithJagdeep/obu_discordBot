const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Collection,
} = require("discord.js");
const cooldownManager = require("../utils/cooldownManager");

class FireflyGame {
  constructor() {
    this.fireflyEmoji = "🪰";
    this.emptyEmoji = "⬛";
    this.cooldownTime = 1000; // 4 minutes cooldown
    this.fireflyPosition = null;
  }

  async startGame(input) {
    const isInteraction = !!input.isCommand;
    const userId = isInteraction ? input.user.id : input.author.id;
    const timeLeft = cooldownManager.isOnCooldown(userId, this.cooldownTime);

    if (timeLeft > 0) {
      return this.reply(
        input,
        `⏳ Please wait **${timeLeft} seconds** before catching fireflies again!`,
        true
      );
    }

    this.fireflyPosition = Math.floor(Math.random() * 9);
    const embed = this.createGameEmbed();
    const buttons = this.createButtons();

    const reply = await this.reply(
      input,
      { embeds: [embed], components: this.createRows(buttons) },
      false
    );

    this.startCollector(input, reply);
  }

  createGameEmbed() {
    return new EmbedBuilder()
      .setTitle("Catch the Firefly!")
      .setDescription("Click the button where you think the firefly is hiding!")
      .setColor(0xffd700);
  }

  createButtons() {
    return Array.from({ length: 9 }, (_, i) =>
      new ButtonBuilder()
        .setCustomId(`firefly_${i}`)
        .setEmoji(
          i === this.fireflyPosition ? this.fireflyEmoji : this.emptyEmoji
        )
        .setStyle(ButtonStyle.Secondary)
    );
  }

  createRows(buttons) {
    return [
      new ActionRowBuilder().addComponents(buttons.slice(0, 3)),
      new ActionRowBuilder().addComponents(buttons.slice(3, 6)),
      new ActionRowBuilder().addComponents(buttons.slice(6, 9)),
    ];
  }

  async reply(input, content, ephemeral = false) {
    if (typeof content === "string") {
      // Simple text reply
      return input.isCommand
        ? input.reply({ content, ephemeral }) // Slash command
        : input.reply(content); // Message command
    } else {
      // Embed or button content
      return input.isCommand
        ? input.reply({ ...content, ephemeral }) // Slash command
        : input.reply(content); // Message command
    }
  }

  startCollector(input, reply) {
    const isInteraction = !!input.isCommand;
    const filter = (btnInput) =>
      btnInput.user.id === (isInteraction ? input.user.id : input.author.id);
    const collector = reply.createMessageComponentCollector({
      filter,
      time: 2 * 60 * 1000,
    });

    let caught = false;
    const movementInterval = setInterval(async () => {
      this.fireflyPosition = Math.floor(Math.random() * 9);
      await this.editReply(input, {
        components: this.createRows(this.createButtons()),
      });
    }, 1500);

    collector.on("collect", async (btnInput) => {
      await btnInput.deferUpdate();
      collector.stop();
      clearInterval(movementInterval);

      if (btnInput.customId === `firefly_${this.fireflyPosition}`) {
        caught = true;
        return this.editReply(input, {
          embeds: [this.createWinEmbed()],
          components: [],
        });
      } else {
        return this.editReply(input, {
          embeds: [this.createLoseEmbed()],
          components: [],
        });
      }
    });

    collector.on("end", async () => {
      clearInterval(movementInterval);
      if (!caught) {
        return this.editReply(input, {
          embeds: [this.createTimeoutEmbed()],
          components: [],
        });
      }
    });
  }

  async editGameMessage(channel, messageId, newContent) {
    try {
      const message = await channel.messages.fetch(messageId);

      if (message.author.id !== message.client.user.id) {
        console.error("Error: Cannot edit a message sent by another user.");
        return;
      }

      await message.edit(newContent);
    } catch (error) {
      console.error("Error fetching or editing message:", error);
    }
  }

  async editReply(input, content) {
    if (!input || !content) {
      console.error("Error: 'input' or 'content' is missing.");
      return;
    }

    try {
      if (input.isCommand) {
        await input.editReply(content); // Slash command
      } else {
        // Fetch the last message sent by the bot in the channel
        const messages = await input.channel.messages.fetch({ limit: 10 });
        const botMessage = messages.find(
          (msg) => msg.author.id === input.client.user.id
        );

        if (!botMessage) {
          console.error("Error: No bot message found to edit.");
          return;
        }

        await botMessage.edit(content);
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  }

  createWinEmbed() {
    return new EmbedBuilder()
      .setTitle("You caught a Firefly!")
      .setDescription("+1 🪰 firefly added to your collection.")
      .setColor(0x00ff00);
  }

  createLoseEmbed() {
    return new EmbedBuilder()
      .setTitle("Missed!")
      .setDescription("That was the wrong button. The firefly escaped.")
      .setColor(0xff0000);
  }

  createTimeoutEmbed() {
    return new EmbedBuilder()
      .setTitle("Too Slow!")
      .setDescription("You didn't react in time. The firefly flew away.")
      .setColor(0x7289da);
  }
}

module.exports = new FireflyGame();
