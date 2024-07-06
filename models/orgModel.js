const { sequelize } = require(".");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const orgModel = sequelize.define("organisation", {
    orgId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return orgModel;
};
