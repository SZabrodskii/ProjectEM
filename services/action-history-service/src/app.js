const amqplib = require('amqplib');

const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect('amqp://rabbitmq');
        const channel = await connection.createChannel();
        await channel.assertQueue('action-history', { durable: false });

        channel.consume('action-history', (message) => {
            if (message !== null) {
                console.log('Received:', message.content.toString());
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

connectRabbitMQ();