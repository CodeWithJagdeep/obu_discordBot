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
  "birthday",

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

  "birthday",
  "newYear",
  "christmas",
  "easter",
  "valentinesday",
  "halloween",
  "thanksgiving",
  "independenceday",
  "anniversary",
  "mothersday",
  "fathersDay",
  "friendshipday",
  "diwali",
  "ramadaneid",
  "holi",
  "scare",
  "celebration",
];

const specialOcc = [
  "birthday",
  "newYear",
  "christmas",
  "easter",
  "valentinesday",
  "halloween",
  "thanksgiving",
  "independenceday",
  "anniversary",
  "mothersday",
  "fathersday",
  "friendshipday",
  "diwali",
  "ramadaneid",
  "holi",
];

const wishes = (name) => ({
  birthday: `🎉 Happy Birthday, ${name}! May your day be filled with joy, laughter, and lots of cake! 🎂🥳`,
  newyear: `🎊 Happy New Year, ${name}! Wishing you a year full of success, happiness, and new adventures! 🥂🎆`,
  christmas: `🎄 Merry Christmas, ${name}! May your heart be filled with warmth, love, and holiday cheer! 🎁🎅`,
  easter: `🐣 Happy Easter, ${name}! May your day be as bright and colorful as an Easter egg! 🌸🥚`,
  valentinesday: `💖 Happy Valentine's Day, ${name}! May your day be filled with love, romance, and sweet moments! 💘🌹`,
  halloween: `🎃 Happy Halloween, ${name}! Hope your night is full of spooky fun and lots of treats! 👻🍬`,
  thanksgiving: `🦃 Happy Thanksgiving, ${name}! Wishing you a day filled with gratitude, love, and delicious food! 🍁🥧`,
  independenceday: `🎆 Happy Independence Day, ${name}! Let's celebrate freedom and the spirit of unity! 🇺🇸🎇`,
  anniversary: `💞 Happy Anniversary, ${name}! Wishing you endless love and cherished memories! 💍🎊`,
  graduation: `🎓 Congratulations, ${name}! Your hard work has paid off—wishing you success ahead! 🎉📜`,
  wedding: `💍 Congratulations on your wedding, ${name}! Wishing you a lifetime of love and happiness! 💕✨`,
  engagement: `💎 Congratulations on your engagement, ${name}! May this journey be filled with love and joy! 💑💖`,
  promotion: `🎊 Congrats on your promotion, ${name}! Wishing you great success in your new role! 🚀🏆`,
  retirement: `🎉 Happy Retirement, ${name}! Wishing you a wonderful new chapter full of relaxation and joy! 🌟🏖️`,
  babyshower: `👶🎀 Congratulations, ${name}! Wishing you and your little one a world of happiness! 🍼💕`,
  mothersday: `🌸 Happy Mother's Day, ${name}! Thank you for your love, kindness, and endless support! 💖👩‍👧`,
  fathersDay: `👔 Happy Father's Day, ${name}! You're an incredible role model and hero in our lives! 💙👨‍👧‍👦`,
  friendshipDay: `🤝 Happy Friendship Day, ${name}! Grateful to have you as a wonderful friend! 💛🎉`,
  diwali: `🪔 Happy Diwali, ${name}! May your life be filled with light, prosperity, and happiness! 🎆✨`,
  ramadaneid: `🌙 Eid Mubarak, ${name}! Wishing you peace, joy, and countless blessings! 🕌🍽️`,
  hanukkah: `🕎 Happy Hanukkah, ${name}! May your days be filled with light, love, and laughter! ✨🎶`,
  holi: `🎨 Happy Holi, ${name}! May your life be as colorful and vibrant as this festival! 🌈🎉`,
});

const reflectedEmotion = (name, emotion) => {
  const emotions = {
    scare: `😨 Oh no, ${name} is feeling scared! Hold on tight, it's getting spooky! 👻🎃`,
    happy: `😊 Yay! ${name} is feeling super happy today! Keep smiling! 😄🌟`,
    sad: `😢 Oh no, ${name} is feeling down. Sending virtual hugs your way! 🤗💙`,
    excited: `🎉 Woohoo! ${name} is feeling excited! Let's celebrate! 🎊🥳`,
    angry: `😠 Uh-oh! ${name} is feeling angry. Take a deep breath and relax! 🧘‍♂️🔥`,
  };

  return emotions[emotion] || null;
};

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

module.exports = {
  emotions,
  obuCommands,
  specialOcc,
  wishes,
  reflectedEmotion,
};
