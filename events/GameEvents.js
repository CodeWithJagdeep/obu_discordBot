const RpsModel = require("../Models/RpsModel");

async function resolveGame(message, challengerId, opponentId, moves) {
  const challengerMove = moves[challengerId];
  const opponentMove = moves[opponentId];

  // Determine the winner
  let result;
  let win = 0;
  let loss = 0;
  if (challengerMove === opponentMove) {
    result = "It's a tie!";
  } else if (
    (challengerMove === "rock" && opponentMove === "scissors") ||
    (challengerMove === "paper" && opponentMove === "rock") ||
    (challengerMove === "scissors" && opponentMove === "paper")
  ) {
    result = `<@${challengerId}> wins! 🎉`;
    winnerId = 1;
  } else {
    result = `<@${opponentId}> wins! 🎉`;
    loss = 1;
  }
  // Fetch the author's server nickname or username
  const opponentData = await message.guild.members.fetch(opponentId);
  const opponentName = opponentData.nickname || opponentData.user.username;

  let alreadyPlayed = await RpsModel.findOne({
    challengerId: challengerId,
    opponentId: opponentId,
    guildId: message.guild.id,
    changerName: message.author.username,
    opponentName: opponentName,
  });

  if (alreadyPlayed) {
    alreadyPlayed.wins += win;
    alreadyPlayed.loss += loss;
    await alreadyPlayed.save();
    // Announce the result
    return await message.channel.send(`**Game Result:**\n` + `**${result}** `);
  } else {
    await RpsModel.create({
      challengerId: challengerId,
      opponentId: opponentId,
      wins: win,
      loss: loss,
      guildId: message.guild.id,
      changerName: message.author.username,
      opponentName: opponentName,
    });

    // Announce the result
    return await message.channel.send(
      `**Game Result:**\n` +
        `<@${challengerId}> chose **${challengerMove}**.\n` +
        `<@${opponentId}> chose **${opponentMove}**.\n` +
        `**${result}**`
    );
  }
}

module.exports = { resolveGame };
