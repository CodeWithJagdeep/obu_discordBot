# OBU Discord Bot

OBU is a feature-rich Discord bot designed to enhance user engagement, automate moderation, and provide entertainment through games and music. This bot includes commands for user interaction, GIF responses based on emotions, a points-based activity system, and music playback using DisTube.

## 🚀 Features

- **Command Handling** - Responds to user commands efficiently.
- **User Activity Tracking** - Assigns points to active users.
- **Emotion-based GIF Responses** - Sends relevant GIFs when keywords are detected.
- **Welcome & Leave Messages** - Greets new members and notifies kicked users.
- **Mini-Games** - Includes an interactive game (`!startdiary`).
- **Music Streaming** - Uses DisTube for high-quality audio playback.
- **Spam Detection** - Prevents unwanted spam messages.

## 📁 Project Structure

```
/obu-bot
│── Controllers/
│   ├── CommandsController.js
│   ├── GameController.js
│── data/
│   ├── emotions.js
│── events/
│   ├── messageEvent.js
│   ├── guildMemberAdd.js
│   ├── userEvents.js
│   ├── GameEvents.js
│── Models/
│   ├── UserActivity.js
│── .env
│── index.js
│── package.json
│── README.md
```

## 🛠️ Installation

### Prerequisites
Ensure you have:
- **Node.js (v16 or later)**
- **npm or yarn**
- **A Discord bot token** (from the [Discord Developer Portal](https://discord.com/developers/applications))

### Steps to Install

1. Clone the repository:
   ```sh
   git clone https://github.com/WorkwithJagdeep/obu-discord-bot.git
   cd obu-discord-bot
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file and add your bot token:
   ```sh
   BOT_TOKEN=your_discord_bot_token
   ```

4. Run the bot:
   ```sh
   node index.js
   ```

## 🎵 Music Bot Setup

This bot uses **DisTube** to play music from YouTube and SoundCloud.
Ensure the bot has the **`GuildVoiceStates`** intent enabled in the Developer Portal.

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `obu commands` | Displays available commands. |
| `obu <emotion>` | Sends a GIF based on the detected emotion keyword. |
| `!startdiary` | Starts a game with mentioned users. |
| `spam` | Handles spam messages. |

## 🔧 Deployment
For a persistent bot, deploy using a process manager like **PM2**:
```sh
npm install -g pm2
pm2 start index.js --name "obu-bot"
```

## 🤝 Contributing
Feel free to fork and contribute! Open an issue or submit a pull request.

## 📝 License
This project is licensed under the **MIT License**.

---

🚀 **Developed by Jagdeep Singh**

