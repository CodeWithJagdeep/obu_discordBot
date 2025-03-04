const { AuditLogEvent } = require("discord.js");

const _handleKickedMember = (client) => {
  client.on("guildMemberRemove", async (member) => {
    try {
      const auditLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberKick,
      });

      const kickLog = auditLogs.entries.first();
      if (kickLog && kickLog.target.id === member.id) {
        const { executor, reason } = kickLog;
        // Send DM with a warning to the user when they are kicked
        await member.user.send(
          `⚠️ Warning: You were kicked from ${member.guild.name} by ${
            executor.tag
          }. Reason: ${
            reason || "No reason provided"
          }.\n\nPlease be mindful of the community guidelines to avoid future issues.`
        );
      } else {
        // Send DM to the user when they leave voluntarily
        await member.user.send(
          `You left ${member.guild.name}. We're sorry to see you go! If you change your mind, feel free to join again.`
        );
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    }
  });
};

module.exports = { _handleKickedMember };
