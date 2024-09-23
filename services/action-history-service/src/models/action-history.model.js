const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const ActionHistory = sequelize.define('ActionHistory', {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'action_history',
  timestamps: false,
});

module.exports = ActionHistory;
