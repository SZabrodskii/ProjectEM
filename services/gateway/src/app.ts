import Fastify, {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import * as amqplib from 'amqplib';
import * as process from "process";

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
    await channel.assertQueue('action-history', {durable: false});
    fastify.log.info('Queue assertion successful.');
  } catch (error) {
    if (error instanceof Error) {
      fastify.log.error('Failed to connect to RabbitMQ:'+ error.message);
      setTimeout(connectRabbitMQ, 1000); // Повторная попытка через 1 сек
    } else {
      fastify.log.error('Failed to connect to RabbitMQ:', 'Unknown error');
    }
  }
};

fastify.get('/api/example', async (request, reply) => {
  if (!channel) {
    fastify.log.error('RabbitMQ channel is not initialized.');
    return reply.status(500).send({error: 'Internal Server Error'});
  }

  const message = 'Product action triggered';
  const sent = channel.sendToQueue('action-history', Buffer.from(message));

  if (!sent) {
    fastify.log.error('Failed to send message to RabbitMQ queue.');
    return reply.status(500).send({error: 'Failed to send message to queue'});
  }

  return {message: 'Hello from Gateway!'};
});

fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof Error) {
    request.log.error(error);
    reply.status(500).send({error: 'Internal Server Error'});
  } else {
    request.log.error('An unknown error occurred');
    reply.status(500).send({error: 'Internal Server Error'});
  }
});

const start = async () => {
  try {
    await connectRabbitMQ();
    await fastify.listen({port: 3002, host: '0.0.0.0'});

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
