const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Meme = sequelize.define(
  "Meme",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    current: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Set a default value for streak
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: "Memes", // Optional: set custom table name
  }
);

module.exports = { Meme };
