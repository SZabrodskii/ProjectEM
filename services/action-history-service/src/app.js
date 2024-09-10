require('dotenv').config();
const amqplib = require('amqplib');
const { connectDatabase } = require('./database');
const ActionHistory = require('./models/action-history.model');
const Fastify = require('fastify');
const { registerRoutes } = require('./routes');

const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_DSN);
    const channel = await connection.createChannel();
    await channel.assertQueue('action-history', { durable: true });

    channel.consume('action-history', async (message) => {
      if (message !== null) {
        const content = message.content.toString();
        const actionData = JSON.parse(content);

        console.log('Received:', actionData);

        await ActionHistory.create({
          shop_id: actionData.shop_id,
          plu: actionData.plu,
          action: actionData.action,
          date: new Date(),
        });

        channel.ack(message);
      }
    });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};

const fastify = Fastify({ logger: true });

registerRoutes(fastify);

const startApp = async () => {
  await connectDatabase();
  await connectRabbitMQ();
  await fastify.listen({ port: 3001 });
  console.log('Action history service is running on http://localhost:3001');
};

startApp();
