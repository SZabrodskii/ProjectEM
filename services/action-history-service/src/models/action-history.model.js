const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database');

class ActionHistory extends Model {}

ActionHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shop_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'action_histories',
    timestamps: false,
  }
);

export default ActionHistory;
