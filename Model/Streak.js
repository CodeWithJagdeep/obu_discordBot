const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Streak = sequelize.define(
  "Streak",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friendId: {
      type: DataTypes.STRING,
      allowNull: true, // If a friendId is optional
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Set a default value for streak
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: "Streaks", // Optional: set custom table name
  }
);

module.exports = { Streak };
