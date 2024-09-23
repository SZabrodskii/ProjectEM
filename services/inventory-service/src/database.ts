import { DataSource, DataSourceOptions } from 'typeorm';
import { Stock } from './models/stock.model';
import { Product } from './models/product.model';
import * as process from "process";
import { FastifyInstance } from "fastify";

const options: DataSourceOptions = {
    name: 'default',
    type: 'postgres',
    host: 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Stock, Product],
    synchronize: true,
} as DataSourceOptions;

export const connectToDatabase = async (fastify: FastifyInstance) => {
  const appDataSource = new DataSource(options);
  while (true) {
    try {
      await appDataSource.initialize();

      fastify.log.info('Connected to the database');
      return appDataSource;
    } catch (error) {
      fastify.log.error('Failed to connect to the database. Retrying in 1 second...', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

