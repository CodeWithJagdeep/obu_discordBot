# OBU Discord Bot

**OBU** is an interactive Discord bot designed to enhance user engagement and automate various tasks within a Discord server. The bot can send engaging memes, welcome new users, and generate personalized GIFs, boosting daily interactions and improving the overall community experience.

## Features

- **Meme Sharing**: Automatically sends random memes to the server, keeping the environment fun and lively.
- **Welcome Messages**: Greets new members when they join the server to create a friendly atmosphere.
- **Interactive GIFs**: Sends relevant, non-repeating GIFs when specific action keys, like 'kick,' are used.
- **Auto-responses**: Responds to user interactions with personalized replies and actions.
  
## Technologies Used

- **Discord.js**: A powerful Node.js library used for interacting with the Discord API.
- **Node.js**: JavaScript runtime used to build the bot.
- **npm**: Package manager for managing dependencies.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/CodeWithJagdeep/obu_discordBot.git
   ```

2. Navigate to the project directory:
   ```bash
   cd obu_discordBot
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your bot's token:
   ```env
   BOT_TOKEN=your-discord-bot-token-here
   TENOR_GIF_TOKEN=your-tenor-api-token-here
   GOOGLE_CLIENT_ID=your-google-client-id-here

   ```

5. Run the bot:
   ```bash
   npm start
   ```

## Usage

Once the bot is running, it will automatically perform its functions in your Discord server, such as sending memes, welcoming new users, and providing GIFs. You can customize the bot further by modifying the code in the `index.js` file.

## Contributing

1. Fork the repository.
2. Create your branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
