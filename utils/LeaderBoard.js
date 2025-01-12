const leaderBoardPage = (topUsers) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Top 5 Streaks</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #f0f0f0, #d9e4f5);
      margin: 0;
    }
    .leaderboard {
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 350px;
      text-align: center;
    }
    .leaderboard h1 {
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
    }
    .leaderboard ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .leaderboard li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid #f0f0f0;
    }
    .leaderboard li:last-child {
      border-bottom: none;
    }
    .profile {
      display: flex;
      align-items: center;
    }
    .profile img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .profile span {
      font-size: 16px;
      color: #555;
    }
    .streak {
      font-size: 16px;
      font-weight: bold;
      color: #ff5722;
    }
  </style>
</head>
<body>
  <div class="leaderboard">
    <h1>Top 5 Streaks</h1>
    <ul>
      ${topUsers
        .map(
          (user) => `
        <li>
          <div class="profile">
            <img src="${user.avatar}" alt="${user.name}">
            <span>${user.name}</span>
          </div>
          <span class="streak">🔥 ${user.streak}</span>
        </li>
      `
        )
        .join("")}
    </ul>
  </div>
</body>
</html>
`;

const topUsers = [
  {
    name: "John Doe",
    avatar: "https://www.example.com/avatar1.jpg", // Replace with actual image URL
    streak: 15,
  },
  {
    name: "Jane Smith",
    avatar: "https://www.example.com/avatar2.jpg", // Replace with actual image URL
    streak: 12,
  },
  {
    name: "Alice Johnson",
    avatar: "https://www.example.com/avatar3.jpg", // Replace with actual image URL
    streak: 10,
  },
  {
    name: "Bob Lee",
    avatar: "https://www.example.com/avatar4.jpg", // Replace with actual image URL
    streak: 9,
  },
  {
    name: "Charlie Brown",
    avatar: "https://www.example.com/avatar5.jpg", // Replace with actual image URL
    streak: 8,
  },
];

module.exports = { leaderBoardPage, topUsers };
