const { Collection } = require("discord.js");

class CooldownManager {
  constructor() {
    this.cooldowns = new Collection();
  }

  isOnCooldown(userId, cooldownTime) {
    const now = Date.now();
    if (this.cooldowns.has(userId)) {
      const expirationTime = this.cooldowns.get(userId) + cooldownTime;
      if (now < expirationTime) {
        return Math.ceil((expirationTime - now) / 1000);
      }
    }
    this.cooldowns.set(userId, now);
    return 0; // No cooldown
  }
}

module.exports = new CooldownManager();
