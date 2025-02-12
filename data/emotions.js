const emotions = [
  // Physical Actions
  "slap",
  "shy",
  "punch",
  "sad",
  "excited",
  "angry",
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
    // Physical Actions
    slap: `👋 Ouch! ${name} just got slapped! That must've hurt! 😲`,
    shy: `😳 ${name} is feeling a little shy! Don't be afraid! 🌸`,
    punch: `🥊 Whoa! ${name} just threw a punch! Hope it was a friendly one! 😅`,
    sad: `😢 Oh no, ${name} is feeling down. Sending virtual hugs your way! 🤗💙`,
    excited: `🎉 Woohoo! ${name} is feeling excited! Let's celebrate! 🎊🥳`,
    angry: `😠 Uh-oh! ${name} is feeling angry. Take a deep breath and relax! 🧘‍♂️🔥`,
    hug: `🤗 ${name} is giving a big warm hug! So comforting! 💕`,
    tickle: `😆 ${name} is being tickled! That must be fun! 😂`,
    poke: `👉 ${name} just got poked! Who did that? 😜`,
    pat: `🖐️ ${name} received a gentle pat! That's so kind! 😊`,
    cuddle: `💞 ${name} is enjoying a cozy cuddle! So wholesome! 🥰`,
    highfive: `✋ Boom! ${name} just gave an epic high-five! 🎉`,
    headpat: `🐾 Aww, ${name} is getting headpats! Such a good one! 💕`,
    bite: `😬 Whoa! ${name} just bit someone! Hope it wasn’t too hard! 🦷`,
    lick: `👅 Yikes! ${name} just licked someone! That’s kinda funny! 😂`,
    kick: `🦵 Pow! ${name} delivered a kick! Hope no one got hurt! 😆`,
    boop: `🐽 Boop! ${name} just booped someone’s nose! How cute! 🥰`,
    wave: `👋 ${name} is waving happily! Hello there! 🌟`,
    hold: `👐 ${name} is holding hands! How sweet! 💕`,
    pinch: `🤏 Ouch! ${name} just got pinched! Who did that? 😜`,
    nudge: `😏 ${name} gave a gentle nudge! Wonder what that means! 🤔`,
    tap: `👆 ${name} just tapped someone! Attention, please! 🛎️`,
    shove: `🙄 ${name} just shoved someone! Hope it's playful! 😂`,
    headlock: `💪 Uh-oh! ${name} just put someone in a headlock! Wrestle time! 🥋`,

    // Reactions/Expressions
    blush: `😊 Aww, ${name} is blushing! So adorable! 😳💕`,
    cry: `😭 ${name} is crying! Here, take a tissue! 🤗`,
    smile: `😃 ${name} is smiling brightly! Keep spreading positivity! 🌞`,
    dance: `💃🎶 ${name} is dancing! Let's groove together! 🕺`,
    shrug: `🤷 ${name} is unsure! It's okay, we all get confused sometimes! 🤔`,
    smirk: `😏 ${name} has a sly smirk! What's the plan? 😆`,
    grin: `😁 ${name} is grinning! That must mean something good! 😁`,
    thumbsup: `👍 ${name} is giving a thumbs up! Great job! 🌟`,
    wag: `🐶 ${name} is wagging their tail! Excited much? 🐾`,
    sleepy: `😴 ${name} is feeling sleepy! Time for some rest! 🌙`,
    teehee: `😆 Teehee! ${name} is feeling playful! What’s so funny? 😂`,
    pout: `😡 ${name} is pouting! Somebody cheer them up! ☹️`,
    triggered: `🤬 Uh-oh! ${name} is triggered! Take it easy! 🚨`,
    thinking: `🤔 Hmm... ${name} is deep in thought! What’s on your mind? 🧠`,
    cheer: `🎉 Woo! ${name} is cheering! Let’s go! 🎊`,
    frown: `☹️ ${name} is frowning! Cheer up, friend! 💕`,
    wink: `😉 ${name} just winked! What’s the secret? 🤫`,
    facepalm: `🤦 ${name} just did a facepalm! Oh dear! 🤷`,
    laugh: `😂 ${name} is laughing so hard! What’s so funny? 🤣`,
    clap: `👏 ${name} is clapping! Bravo! 👏`,
    groan: `😖 ${name} is groaning! Something went wrong? 😵`,
    yawn: `🥱 ${name} just yawned! Someone needs sleep! 😴`,
    nod: `🙆 ${name} nodded in agreement! Good choice! ✅`,
    shakehead: `🙅 ${name} shook their head! Disapproving much? 😒`,
    welcome: `🎉 Welcome! ${name} is greeting everyone! Let’s give a warm welcome! 🤗`,

    // Intense/Funny Actions
    kill: `☠️ Yikes! ${name} is out for blood! Run! 🏃‍♂️💨`,
    insult: `😤 ${name} just threw an insult! Shots fired! 🔥`,
    stare: `👀 ${name} is staring! That’s kinda creepy… 😳`,
    roast: `🔥 ${name} is roasting someone! The burn is real! 😆`,
    yeet: `🚀 ${name} just YEETED something! That flew far! 😂`,
    mock: `😜 ${name} is mocking someone! Better watch out!`,
    scream: `😱 AHHH! ${name} is screaming! What happened?! 😨`,
    rage: `🔥 ${name} is in full rage mode! Watch out! 💢`,
    sulk: `🙁 ${name} is sulking! Someone needs cheering up! 💕`,
    gasp: `😲 Whoa! ${name} just gasped! What’s the surprise? 🎁`,
    runaway: `🏃‍♂️💨 ${name} just ran away! Come back! 😭`,

    // Love/Kiss Actions
    kiss: `😘 ${name} just gave a sweet kiss! How romantic! 💖`,
    love: `❤️ ${name} is feeling the love! So wholesome! 😍`,
    affection: `💕 ${name} is showing affection! How sweet! 🥰`,
    romance: `💘 ${name} is in the mood for romance! Love is in the air! 💞`,
    crush: `😍 ${name} has a crush! Who is it?! 👀`,
    embrace: `🤗 ${name} is embracing someone! Such warm vibes! 💖`,
    flirt: `😏 ${name} is flirting! Someone's getting spicy! 🔥`,

    // Celebrations
    birthday: `🎂 Happy Birthday, ${name}! Make a wish! 🎉`,
    newYear: `🎆 Happy New Year, ${name}! Wishing you the best! 🥳`,
    christmas: `🎄 Merry Christmas, ${name}! Enjoy the festive spirit! 🎁`,
    easter: `🐣 Happy Easter, ${name}! Let’s find some eggs! 🍫`,
    valentinesday: `💖 Happy Valentine’s Day, ${name}! Sending love your way! 💘`,
    vlsday: `💖 Happy Valentine’s Day, ${name}! Sending love your way! 💘`,
    halloween: `🎃 Boo! ${name} is celebrating Halloween! Trick or treat! 👻`,
    thanksgiving: `🦃 Happy Thanksgiving, ${name}! Time for a feast! 🍗`,
    diwali: `🪔 Happy Diwali, ${name}! May your life shine bright! ✨`,
    ramadaneid: `🌙 Eid Mubarak, ${name}! Wishing you peace and happiness! 🤲`,
    holi: `🎨 Happy Holi, ${name}! Let’s play with colors! 🌈`,
    celebration: `🎊 ${name} is celebrating! Let’s party! 🎉`,
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
