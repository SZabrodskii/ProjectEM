import * as Fastify from 'fastify';
import * as amqplib from 'amqplib';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { AppDataSource } from './database';
import * as process from "process";
import {StockController} from "./controllers/stock.controller";
import {StockService} from "./services/stock.service";
import {FastifyReply, FastifyRequest} from "fastify";

const fastify = Fastify({ logger: true });

const startApp = async () => {
  await AppDataSource.initialize();

  const channel = await connectRabbitMQ();
  console.log('Connected to RabbitMQ');

  const productService = new ProductService();
  const productController = new ProductController(productService, channel);
  const stockService = new StockService();
  const stockController = new StockController(stockService, channel);

  fastify.post('/products', (request: FastifyRequest, reply: FastifyReply) => productController.createProduct(request, reply));
  fastify.get('/products', (request: FastifyRequest, reply: FastifyReply) => productController.getProducts(request, reply));

  fastify.post('/stocks', (request: FastifyRequest, reply: FastifyReply) => stockController.createStock(request, reply));
  fastify.put('/stocks/increase', (request: FastifyRequest, reply: FastifyReply) => stockController.increaseStock(request, reply));
  fastify.put('/stocks/decrease', (request: FastifyRequest, reply: FastifyReply) => stockController.decreaseStock(request, reply));
  fastify.get('/stocks', (request: FastifyRequest, reply: FastifyReply) => stockController.getStocks(request, reply));


  productController.consumeMessages();

  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const connectRabbitMQ = async () => {
  while (true) {
    try {
      const connection = await amqplib.connect('amqp://rabbitmq:5672');
      connection.on('close', () => setTimeout(connectRabbitMQ, 1000));

      const channel = await connection.createChannel();
      await channel.assertQueue('action-history', { durable: true });

      return channel;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ. Retrying in 1 second...', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

startApp();


const start = async () => {
  try {
    await connectRabbitMQ().then(channel => {
      const ps = new ProductService()
      const pc = new ProductController(ps, channel);

      return channel
    }).then(channel => {
      process.on('SIGINT', async () => {
        await channel.close();

        try {
          process.exit(0);
        } catch (err) {
          process.exit(1);
        }
      });
    });
  } catch (err) {
    process.exit(1);
  }
};

start();
