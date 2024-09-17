import * as Fastify from 'fastify';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { connectToDatabase } from './database';
import * as process from "process";
import { StockController } from "./controllers/stock.controller";
import { StockService } from "./services/stock.service";
import { FastifyReply, FastifyRequest } from "fastify";

const fastify = Fastify({ logger: true });

const startApp = async () => {
  const dataSource = await connectToDatabase();

  const productService = new ProductService(dataSource);
  const productController = new ProductController(productService);
  const stockService = new StockService(dataSource);
  const stockController = new StockController(stockService);

  fastify.post('/products', (request: FastifyRequest, reply: FastifyReply) => productController.createProduct(request, reply));
  fastify.get('/products', (request: FastifyRequest, reply: FastifyReply) => productController.getProducts(request, reply));

  fastify.post('/stocks', (request: FastifyRequest, reply: FastifyReply) => stockController.createStock(request, reply));
  fastify.put('/stocks/increase', (request: FastifyRequest, reply: FastifyReply) => stockController.increaseStock(request, reply));
  fastify.put('/stocks/decrease', (request: FastifyRequest, reply: FastifyReply) => stockController.decreaseStock(request, reply));
  fastify.get('/stocks', (request: FastifyRequest, reply: FastifyReply) => stockController.getStocks(request, reply));

  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startApp();
