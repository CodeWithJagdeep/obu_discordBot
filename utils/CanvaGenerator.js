const { createCanvas, loadImage, registerFont } = require("@napi-rs/canvas");
const fs = require("fs");

async function generateLeaderboardImage(data, actionType = "hug") {
  const maxUserLength = Math.max(
    ...data.map((user) => user.userName.length),
    4
  ); // Minimum "User"
  const maxFriendLength = Math.max(
    ...data.map((user) => user.toUserName.length),
    6
  ); // Minimum "Friend"

  const userHeader = "User".padEnd(maxUserLength, " ");
  const friendHeader = "Friend".padEnd(maxFriendLength, " ");

  let output = `🎶 ${actionType.toUpperCase()} LEADERBOARD\n\n`;
  output += `Rank  ${userHeader}  ${friendHeader}  Count\n`;
  output += `----  ${"-".repeat(maxUserLength)}  ${"-".repeat(
    maxFriendLength
  )}  -----\n`;

  data.forEach((user, index) => {
    const rank = `#${index + 1}`.padEnd(5, " ");
    const username = user.userName.padEnd(maxUserLength, " ");
    const toUser = user.toUserName.padEnd(maxFriendLength, " ");
    const count = user.count.toString().padStart(3, " ");
    output += `${rank}${username}  ${toUser}  ${count}\n`;
  });

  return `\`\`\`\n${output}\`\`\``; // Wrap in code block for Discord formatting
}

async function generateLeaderboardRps(data) {
  const maxUserLength = Math.max(
    ...data.map((user) => user.changerName.length),
    4
  ); // At least "User"
  const maxFriendLength = Math.max(
    ...data.map((user) => user.opponentName.length),
    8
  ); // At least "Opponent"
  const maxWinsLength = Math.max(
    ...data.map((user) => user.wins.toString().length),
    4
  ); // At least "Wins"
  const maxLossLength = Math.max(
    ...data.map((user) => user.loss.toString().length),
    5
  ); // At least "Loses"

  const headers = [
    { title: "Rank", length: 6 },
    { title: "User", length: maxUserLength },
    { title: "Opponent", length: maxFriendLength },
    { title: "Wins", length: maxWinsLength },
    { title: "Loses", length: maxLossLength },
  ];

  let output = `RPS LEADERBOARD\n\n`;

  // Header Row
  output += headers.map((h) => h.title.padEnd(h.length, " ")).join("  ") + "\n";

  // Separator Row
  output += headers.map((h) => "-".repeat(h.length)).join("  ") + "\n";

  // Data Rows
  data.forEach((user, index) => {
    const row = [
      `#${index + 1}`.padEnd(6, " "),
      user.changerName.padEnd(maxUserLength, " "),
      user.opponentName.padEnd(maxFriendLength, " "),
      user.wins.toString().padEnd(maxWinsLength, " "),
      user.loss.toString().padEnd(maxLossLength, " "),
    ];
    output += row.join("  ") + "\n";
  });

  return `\`\`\`\n${output}\`\`\``; // Keep it in a Discord code block
}


module.exports = { generateLeaderboardImage, generateLeaderboardRps };
