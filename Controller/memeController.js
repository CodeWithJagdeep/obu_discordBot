const { Meme } = require("../Model/Meme");

exports.createMemeIndex = async () => {
  try {
    // Find the first meme record
    const meme = await Meme.findOne();
    if (meme) {
      // Increment the `current` field by 1
      await Meme.update(
        { current: meme.current + 1 }, // Update only the `current` field
        { where: { id: meme.id } } // Specify which record to update
      );
    } else {
      console.log("No meme record found to update.");
      await new Meme({
        current: 0,
      });
      return;
    }
  } catch (error) {
    console.error("Error updating meme:", error.message);
  }
};

exports.getMemePagination = async () => {
  try {
    // Fetch the first meme record (no pagination logic required)
    const meme = await Meme.findOne();
    return meme; // Return the single record
  } catch (error) {
    console.error("Error fetching meme:", error.message);
    return null;
  }
};
