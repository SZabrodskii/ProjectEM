require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
  }
);

module.exports = { sequelize };
