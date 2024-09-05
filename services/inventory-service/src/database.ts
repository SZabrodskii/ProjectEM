import { DataSource } from 'typeorm';
import { Product } from './models/product.model';
import { Stock } from './models/stock.model';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'admin',
    password: 'postgres',
    database: 'project_em',
    entities: [Product, Stock],
    synchronize: true,
});