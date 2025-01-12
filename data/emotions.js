const emotions = [
  // Physical Actions
  "slap",
  "punch",
  "hug",
  "tickle",
  "poke",
  "pat",
  "cuddle",
  "highfive",
  "headpat",
  "bite",
  "lick",
  "kick",
  "boop",
  "wave",
  "hold",
  "pinch",
  "nudge",
  "tap",
  "shove",
  "headlock",

  // Reactions/Expressions
  "blush",
  "cry",
  "smile",
  "dance",
  "shrug",
  "smirk",
  "grin",
  "thumbsup",
  "wag",
  "sleepy",
  "lewd",
  "teehee",
  "pout",
  "triggered",
  "thinking",
  "cheer",
  "frown",
  "wink",
  "facepalm",
  "laugh",
  "clap",
  "groan",
  "yawn",
  "nod",
  "shakehead",
  "fuck",
  "welcome",

  // Intense/Funny Actions
  "kill",
  "insult",
  "stare",
  "roast",
  "slapfight",
  "flex",
  "facepalm",
  "yeet",
  "laugh",
  "crylaugh",
  "mock",
  "scream",
  "explode",
  "rage",
  "hide",
  "sulk",
  "gasp",
  "runaway",

  // Cute/Friendly Actions
  "pet",
  "snuggle",
  "peck",
  "boogie",
  "skip",
  "sniff",
  "pokecheek",
  "glomp",
  "ticklefight",
  "snore",

  // Miscellaneous
  "party",
  "cheers",
  "sneeze",
  "blowkiss",
  "throw",
  "jump",
  "dab",
  "celebrate",
  "shush",
  "thumbsdown",
  "snap",
  "peace",
  "salute",
  "pray",
  "meditate",
  "spin",
  "twerk",
  "moonwalk",

  // Love/Kiss Actions
  "kiss",
  "love",
  "affection",
  "romance",
  "swoon",
  "heart",
  "flirt",
  "embrace",
  "crush",
  "adore",
];

// Categorized emotions as a message to be sent to the channel
const obuCommands = `
**🔹 Emotions Commands List:**

**💪 Physical Actions:**
${emotions.slice(0, 21).join(" | ")}

**😃 Reactions/Expressions:**
${emotions.slice(21, 42).join(" | ")}

**🔥 Intense/Funny Actions:**
${emotions.slice(42, 63).join(" | ")}

**🐾 Cute/Friendly Actions:**
${emotions.slice(63, 74).join(" | ")}

**🎉 Miscellaneous:**
${emotions.slice(74, 94).join(" | ")}

**❤️ Love/Kiss Actions:**
${emotions.slice(94).join(" | ")}
`;

module.exports = { emotions, obuCommands };
