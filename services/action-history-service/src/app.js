const fastify = require('fastify')({ logger: true });
const { sequelize } = require('./database');
const ActionHistory = require('./models/action-history.model');

fastify.post('/actions', async (request, reply) => {
  const { action, timestamp, userId } = request.body;
  try {
    const newAction = await ActionHistory.create({ action, timestamp, userId });

    reply.send(newAction);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create action' });
  }
});

fastify.get('/actions', async (request, reply) => {
  try {
    const actions = await ActionHistory.findAll();

    reply.send(actions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to get actions' });
  }
});

const startApp = async () => {
  try {
    await fastify.listen({ host: "0.0.0.0", port: 3000 });

    sequelize.authenticate()
      .then(() => {
        fastify.log.info('Connection to database has been established successfully.');
      })
      .catch(err => {
        fastify.log.error('Unable to connect to the database:', err);
      });

    fastify.log.info('Action History Service is running on http://localhost:3000\'')
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startApp();
