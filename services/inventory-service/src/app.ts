import Fastify from 'fastify';
import amqplib from 'amqplib';
import { ProductService } from './services/product.service';
import { StockService } from './services/stock.service';
import { productRoutes } from './controllers/product.controller';
import { stockRoutes } from './controllers/stock.controller';

const fastify = Fastify({
    logger: true,
});

let channel: amqplib.Channel;

const connectRabbitMQ = async () => {
    try {
        fastify.log.info('Attempting to connect to RabbitMQ...');
        const connection = await amqplib.connect('amqp://rabbitmq:5672');
        fastify.log.info('Connected to RabbitMQ successfully.');
        connection.on('close', () => {
            fastify.log.warn('Connection to RabbitMQ closed. Attempting to reconnect...');
            setTimeout(connectRabbitMQ, 1000);
        });
        channel = await connection.createChannel();
        await channel.assertQueue('action-history', { durable: false });
        fastify.log.info('Queue assertion successful.');
        channel.consume('action-history', (msg) => {
            if (msg) {
                const message = msg.content.toString();
                fastify.log.info(`Received message from RabbitMQ: ${message}`);
                handleActionHistoryMessage(message);
            }
        }, { noAck: true });
    } catch (error) {
        if (error instanceof Error) {
            fastify.log.error('Failed to connect to RabbitMQ:', error.message);
            setTimeout(connectRabbitMQ, 1000); // Повторная попытка через 1 сек
        } else {
            fastify.log.error('Failed to connect to RabbitMQ:', 'Unknown error');
        }
    }
};

const handleActionHistoryMessage = (message: string) => {
    fastify.log.info(`Processing message: ${message}`);
    const productService = new ProductService();
    productService.processMessage(message);
};

const productService = new ProductService();
const stockService = new StockService();

// Регистрация маршрутов
fastify.register(async (instance) => {
    productRoutes(instance, productService);
    stockRoutes(instance, stockService);
});

const start = async () => {
    try {
        await connectRabbitMQ();
        await fastify.listen({ port: 3001, host: '0.0.0.0' });

        const address = fastify.server.address();
        if (address && typeof address === 'object') {
            fastify.log.info(`Server listening on ${address.port}`);
        } else {
            fastify.log.info(`Server listening`);
        }
    } catch (err) {
        if (err instanceof Error) {
            fastify.log.error(err);
        } else {
            fastify.log.error('Unknown error occurred during startup');
        }
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    fastify.log.info('Received SIGINT. Shutting down...');
    try {
        if (channel) {
            await channel.close();
            fastify.log.info('RabbitMQ channel closed.');
        }
        process.exit(0);
    } catch (err) {
        fastify.log.error('Error during shutdown:', err);
        process.exit(1);
    }
});

start();