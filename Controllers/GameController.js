const CommandsBuilder = require("../events/commandBuilder");
const GameModel = require("../Models/GameModel");
const CommandsController = require("./CommandsController");

class Game {
  constructor(players, message, client) {
    this.players = players; // Array of user IDs
    this.client = client;
    this.submissions = []; // { userId, line, timestamp }
    this.choosedPlayer = []; // Index in players array
    this.timer = null;
    this.isActive = false;
    this.message = message;
    this.CommandsBuilder = new CommandsBuilder();
  }

  /**
   * Returns a random player index that has not yet taken a turn.
   * If all players have had a turn, returns null.
   */
  getRandomPlayer() {
    if (this.choosedPlayer.length >= this.players.length) {
      return null;
    }
    let randomPlayer;
    do {
      randomPlayer = Math.floor(Math.random() * this.players.length);
    } while (this.choosedPlayer.includes(randomPlayer));
    this.choosedPlayer.push(randomPlayer);
    return randomPlayer;
  }

  async CreateGame() {
    const existedGame = await GameModel.findOne({
      GameStatus: true,
      ChannelId: this.message.channelId,
    });
    if (!existedGame) {
      const shuffledPlayers = this.players.sort(() => Math.random() - 0.5); // Shuffling players

      let players = shuffledPlayers.map((player, index) => ({
        userId: player,
        submission: false,
        sequence: index, // Assign sequential order
        thought: "",
      }));

      const game = await GameModel.create({
        GameStatus: true,
        ChannelId: this.message.channelId,
        participants: players,
      });
      return { existed: false, game };
    }
    return { existed: true, game: existedGame };
  }
  /**
   * Starts the game by marking it active, notifying players,
   * and starting the first turn.
   */
  async startGame() {
    const game = await this.CreateGame();
    if (game.existed) {
      return this.message.channel.send("The game is already running");
    } else {
      this.message.channel.send("The diary game is starting!");
      await this.nextTurn(game.game, game.game.participants);
    }
  }

  /**
   * Moves the game to the next turn.
   * If there are no more players to play, ends the game.
   */
  async nextTurn(game, participants) {
    let restParticipants = participants.filter((state) => !state.submission);

    while (restParticipants.length) {
      const currentPlayer = restParticipants[0];

      await this.message.channel.send(
        `It's <@${currentPlayer.userId}>'s turn!`
      );

      // Wait for 60 seconds (or adjust the delay as needed)
      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
      await this.message.channel.send(
        `<@${currentPlayer.userId}>'s Time up! hope you submited.`
      );
      // Find the index of the current player in the participants array
      const index = game.participants.findIndex(
        (p) => p.userId === currentPlayer.userId
      );
      if (index !== -1) {
        // Update the submission status of the current player
        game.participants[index].submission = true;
        console.log(game.participants);
        // Save the updated game document
        await game.save();
      }

      // Update the list of remaining participants
      restParticipants = game.participants.filter((state) => !state.submission);
    }

    // All players have completed their turn, end the game
    await this.endGame(game);
  }

  /**
   * Ends the game by combining all submissions and notifying players.
   */
  async endGame(game) {
    const existedGame = await GameModel.findOne({
      GameStatus: true,
      ChannelId: this.message.channelId,
    });
    game.GameStatus = false;
    await game.save();

    // Combine submissions in the order they were received.
    const finalSequence = existedGame.participants
      .map((s) => s.thought)
      .join(" ");
    this.message.channel.send(
      `The game has ended! Final diary sequence: ${finalSequence}`
    );
    // Optionally, you can also DM the final sequence to each player.
  }
}

module.exports = Game;
