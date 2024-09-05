import Fastify from 'fastify';
import FastifySwagger from '@fastify/swagger';

const fastify = Fastify({
    logger: true,
});

fastify.register(FastifySwagger, {
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'Gateway API',
            description: 'Gateway service documentation',
            version: '0.1.0',
        },
        tags: [
            { name: 'example', description: 'Example endpoint' },
        ],
        schemes: ['http'],
    },
    exposeRoute: true,
});

fastify.get('/api/example', async (request, reply) => {
    return { message: 'Hello from Gateway!' };
});

fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        fastify.log.info(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();