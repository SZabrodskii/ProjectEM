require('dotenv').config(); // Подключаем dotenv
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'action_history',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
};
