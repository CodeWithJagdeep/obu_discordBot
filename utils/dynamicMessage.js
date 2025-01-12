const sendMessage = async (channel, message) => {
  try {
    await channel.send(message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const formatMessage = (message) => {
  return `**Bot says:** ${message}`; // Formatting messages before sending
};

module.exports = { sendMessage, formatMessage };
