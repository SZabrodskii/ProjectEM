import Fastify from 'fastify';
import { ProductService } from './services/product.service';
import { productRoutes } from './controllers/product.controller';
import { stockRoutes } from './controllers/stock.controller';
import { StockService } from './services/stock.service';

const fastify = Fastify({ logger: true });

const productService = new ProductService();
const stockService = new StockService();

fastify.register(productRoutes, { productService });
fastify.register(stockRoutes, { stockService });

const PORT = 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        fastify.log.info(`Server listening on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();