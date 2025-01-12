const { Streak } = require("../Model/Streak");

exports.createStreak = async (data) => {
  console.log(data);
  try {
    const hasStreakUser = await Streak.findOne({
      where: { userId: data.userId, friendId: data.friendId },
    });

    if (hasStreakUser) {
      if (hasStreakUser) {
        const currentTime = new Date();
        const timeDifference = currentTime - new Date(hasStreakUser.updatedAt);

        const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert ms to hours

        if (hoursDifference >= 24 && hoursDifference < 48) {
          // Increment streak only if the time difference is between 24 and 48 hours
          hasStreakUser.streak = hasStreakUser.streak + 1;
          await hasStreakUser.save(); // Save updated streak
          return { streakAdd: true, streaks: hasStreakUser.streak + 1 };
        }
        return { streakAdd: false, streaks: hasStreakUser.streak };
      }
    }

    // Create new streak record if not found
    const streak = await Streak.create({
      userId: data.userId,
      friendId: data.friendId,
      streak: 1, // Default streak is 1 when creating a new streak
    });

    return { streakAdd: true, streaks: 1 };
  } catch (err) {}
};

exports.getStreak = async (userId) => {
  const streaks = await Streak.findAll({
    where: { userId: userId },
    order: [["streak", "DESC"]], // Ordering by the 'streak' column in descending order
  });
  return streaks;
};
