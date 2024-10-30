const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const Image = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      readOnly: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upload_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      readOnly: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      readOnly: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Image;
