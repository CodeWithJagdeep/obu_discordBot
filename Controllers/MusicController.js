class MusicController {
  constructor(client) {
    this.client = client;

    // Initialize DisTube
    this.distube = new DisTube(this.client, {
      leaveOnStop: false,
      emitNewSongOnly: true,
      searchSongs: 0,
      youtubeDL: true,
    });

    // Event Listeners
    this.distube
      .on("playSong", (queue, song) => {
        queue.textChannel.send(`🎶 Playing: **${song.name}**`);
      })
      .on("addSong", (queue, song) => {
        queue.textChannel.send(`✅ Added: **${song.name}** to the queue!`);
      })
      .on("error", (channel, error) => {
        console.error(error);
        channel.send("❌ An error occurred while playing music.");
      });
  }

  async play(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply(
        "❌ You need to be in a voice channel to play music!"
      );
    }

    const query = interaction.options.getString("query");
    if (!query) {
      return interaction.reply("❌ Please provide a song name or URL!");
    }

    await this.distube.play(voiceChannel, query, {
      textChannel: interaction.channel,
      member: interaction.member,
    });

    interaction.reply(`🔍 Searching for: **${query}**`);
  }

  stop(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply(
        "❌ You need to be in a voice channel to stop music!"
      );
    }

    this.distube.stop(interaction.guild);
    interaction.reply("⏹ Music stopped!");
  }
}

module.exports = new MusicController();
