// Exporting a welcome message function
exports.welcomeMessage = (member) => `
    **Welcome to the server, @${member.user.tag}!** 
    🎉✨ We're excited to have you here! 🎉✨

    Please take a moment to introduce yourself, and check out the rules and channels!
    Let’s get ready to have some fun together! 🚀🔥
`;

// Exporting a dynamic message generator for various actions
exports.DynamicMessage = (user1, user2, action) => {
  const messages = {
    pat: [
      "{user1} gave {user2} a gentle pat on the head. So cute!",
      "{user1} patted {user2} on the back. Good job!",
      "{user1} gave {user2} a warm pat. You're the best!",
      "{user1} patted {user2} gently. So wholesome!",
      "{user1} patted {user2} on the head.",
    ],
    poke: [
      "{user1} poked {user2}. Hey, wake up!",
      "{user1} gave {user2} a little poke. What's up with you?",
      "{user1} poked {user2} in the ribs. Gotcha!",
      "{user1} poked {user2} playfully. Stop ignoring me!",
      "{user1} gave {user2} a poke. Don't be shy!",
    ],
    bonk: [
      "{user1} bonked {user2} on the head. Ouch, that’s gotta hurt!",
      "{user1} bonked {user2} lightly. Bad {user2}!",
      "{user1} gave {user2} a good ol' bonk. Don’t mess with me!",
      "{user1} bonked {user2} with a plushie. Soft but still funny!",
      "{user1} bonked {user2} with a hammer. Okay, maybe a little too hard!",
    ],
    wag: [
      "{user1} wagged their tail at {user2}. Feeling happy today?",
      "{user1} wagged their tail. Who’s a good {user2}?",
      "{user1} wagged their tail. {user2} got lucky, huh?",
    ],
    stare: [
      "{user1} stared at {user2} intensely. You’re next!",
      "{user1} gave {user2} a long, unwavering stare. Is there something on my face?",
      "{user1} stared at {user2} with fiery eyes. You can feel the heat!",
      "{user1} gave {user2} a penetrating stare. Trying to read your mind!",
      "{user1} stared at {user2} without blinking. I’m not giving up!",
    ],
    hug: [
      "{user1} gave {user2} a warm hug! So wholesome!",
      "Aww, {user1} hugged {user2}. That's so sweet!",
      "{user1} spread some love and hugged {user2}.",
      "{user1} hugged {user2} tightly. Someone's feeling loved!",
      "Hugs incoming! {user1} hugged {user2}.",
      "{user1} wrapped {user2} in a big hug. Warm fuzzies everywhere!",
      "{user1} shared a wholesome hug with {user2}.",
      "Cuteness overload! {user1} hugged {user2} softly.",
      "Hugs are the best! {user1} gave {user2} a big hug.",
      "{user1} used '/give {user2} hugs 1'!",
    ],
    punch: [
      "BAM! {user1} landed a solid punch on {user2}. Ouch!",
      "{user1} unleashed a flurry of punches on {user2}.",
      "{user1} just punched {user2}. That’s gotta hurt!",
      "{user1} smashed {user2} with a devastating punch.",
      "POW! {user1} showed no mercy and punched {user2} hard!",
      "A sneak attack! {user1} punched {user2} in a fit of rage.",
      "{user1} threw a mean right hook at {user2}. Lights out!",
      "It’s a knockout! {user1} punched {user2} to oblivion.",
      "Watch out! {user1} just punched {user2}. The crowd gasps!",
      "Boxing champ alert! {user1} delivered a deadly punch to {user2}.",
      "AND HIS NAME IS... {user1}! {user1}-1 {user2}-0",
    ],
    bite: [
      "Uh oh! {user1} bit {user2}. Is this a zombie apocalypse?",
      "{user1} showed their teeth and bit {user2}. Nom nom!",
      "{user1} got hungry and took a bite out of {user2}.",
      "{user1} sank their teeth into {user2}. Ferocious!",
      "Yikes! {user1} bit {user2} hard. Someone call a medic!",
      "{user1} decided to munch on {user2}. Ouch!",
      "{user1} bit {user2} like a wild animal. Someone’s hangry!",
      "CHOMP! {user1} bit {user2}. Better watch those fingers!",
      "Run for your life! {user1} bit {user2}. No mercy!",
      "Cannibal vibes? {user1} bit {user2}. Someone’s feeling savage!",
      "I think {user1} mistook {user2} for a wafer.",
    ],
    wave: [
      "{user1} waved enthusiastically at {user2}. Hi there!",
      "Friendly vibes! {user1} waved at {user2} with a big smile.",
      "{user1} waved at {user2}. Are they besties now?",
      "Wave incoming! {user1} waved at {user2} with style.",
      "{user1} sent a cheerful wave towards {user2}. Cute!",
      "Hiya! {user1} waved at {user2}. They look so happy!",
      "The crowd goes wild! {user1} waved at {user2} like royalty.",
      "{user1} waved dramatically at {user2}. A true showstopper!",
      "{user1} waved so hard, their hand almost fell off! {user2} noticed.",
      "Friendly greetings! {user1} waved at {user2} from across the room.",
    ],
    kill: [
      "Fatality! {user1} executed {user2} in cold blood.",
      "Game over! {user1} eliminated {user2}. Rest in pieces.",
      "{user1} used kill! It was ultra-effective! {user2} has died.",
      "Watch out! {user1} assassinated {user2}. Brutal!",
      "{user1} killed {user2}. No respawn button here.",
      "Lights out! {user1} annihilated {user2} with precision.",
      "{user1} ended {user2}’s journey with a swift kill.",
      "Ruthless! {user1} took down {user2}. No survivors.",
      "The end is nigh! {user1} killed {user2} mercilessly.",
      "{user1} obliterated {user2}. Absolute carnage!",
    ],
    lick: [
      "Eww! {user1} just licked {user2}. That’s unexpected.",
      "{user1} licked {user2} like an ice cream cone. Yikes!",
      "{user1} showed affection by licking {user2}. Weird flex!",
      "What was that? {user1} licked {user2} out of nowhere.",
      "{user1} licked {user2} gently. A bit awkward, right?",
      "Lick attack! {user1} licked {user2}. Why tho?",
      "{user1} gave {user2} a slobbery lick. Eww but cute?",
      "Friendly but weird! {user1} licked {user2}.",
      "{user1} stuck out their tongue and licked {user2}. Bold move!",
      "Someone’s feeling playful! {user1} licked {user2} out of nowhere.",
    ],
    kiss: [
      "{user1} used KISS! It was super effective! {user2} has been flattered.",
      "{user1} kissed {user2} on the cheek. How sweet!",
      "Aww, {user1} planted a soft kiss on {user2}. Romantic!",
      "{user1} kissed {user2}. Is that love in the air?",
      "Smooch alert! {user1} kissed {user2} with affection.",
      "A tender moment! {user1} kissed {user2}. So cute!",
      "Lovebirds? {user1} kissed {user2}. Adorable!",
      "{user1} leaned in and kissed {user2}. A perfect moment.",
      "Romantic vibes! {user1} kissed {user2} under the stars.",
      "{user1} kissed {user2}. The crowd ships them!",
      "Swoon-worthy! {user1} kissed {user2} with elegance.",
    ],
    spank: [
      "WHAP! {user1} spanked {user2}. Someone’s in trouble!",
      "{user1} gave {user2} a playful spank. Naughty!",
      "Smack! {user1} spanked {user2}. Oops, did they like that?",
      "{user1} spanked {user2}. That was a bit too much!",
      "{user1} just spanked {user2}. Maybe a little too hard?",
      "SPANK! {user1} gave {user2} a solid smack.",
      "{user1} spanked {user2}. That was quite the surprise!",
      "Watch out! {user1} spanked {user2}. Ouch, but funny!",
      "{user1} spanked {user2} on the behind. Ouch!",
      "{user1} spanked {user2} for being bad. Naughty!",
    ],
  };

  return messages[action]?.[Math.floor(Math.random() * messages[action].length)]
    ?.replace(/{user1}/g, user1)
    .replace(/{user2}/g, user2);
};
