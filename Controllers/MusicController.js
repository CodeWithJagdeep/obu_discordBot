const { YOUTUBE_API } = require("../config/env");

class MusicController {
  constructor(client) {
    this.client = client;

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

  async recommandsSong() {
    try {
      const YOUTUBE_API_KEY = YOUTUBE_API; // Replace with your API Key
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v4/search`,
        {
          params: {
            key: YOUTUBE_API_KEY,
            part: "snippet",
            relatedToVideoId: "o6CvPAWm6dM", // 🔥 Get related videos
            type: "video",
            maxResults: 1, // Get 3 recommended songs
          },
        }
      );

      // ✅ Extract the first recommended song
      if (response.data.items.length > 0) {
        const nextSong = response.data.items[0];
        return {
          title: nextSong.snippet.title,
          videoId: nextSong.id.videoId,
          url: `https://www.youtube.com/watch?v=${nextSong.id.videoId}`,
          thumbnail: nextSong.snippet.thumbnails.default.url,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching next song:", error);
      return null;
    }
  }
}

module.exports = new MusicController();
