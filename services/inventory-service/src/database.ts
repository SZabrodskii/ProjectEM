import { DataSource, DataSourceOptions } from 'typeorm';
import { Stock } from './models/stock.model';
import { Product } from './models/product.model';

const options: DataSourceOptions = {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'admin',
    password: 'postgres',
    database: 'project_em',
    entities: [Stock, Product],
    synchronize: true,
} as DataSourceOptions;

export const AppDataSource = new DataSource(options);

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
    });

const connectToDatabase = async () => {
  while (true) {
    try {
      await AppDataSource.initialize();
      console.log('Connected to the database');
      break;
    } catch (error) {
      console.error('Failed to connect to the database. Retrying in 1 second...', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

connectToDatabase();
