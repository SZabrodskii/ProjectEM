import { FastifyInstance } from 'fastify';
import ActionHistory from './models/action-history.model';

export const registerRoutes = (fastify: FastifyInstance) => {
  fastify.get('/action-history', async (request, reply) => {
    const { shop_id, plu, startDate, endDate, action, page = 1, limit = 10 } = request.query;

    const whereClause: any = {};
    if (shop_id) whereClause.shop_id = shop_id;
    if (plu) whereClause.plu = plu;
    if (action) whereClause.action = action;
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const offset = (page - 1) * limit;

    const history = await ActionHistory.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    reply.send({
      data: history.rows,
      total: history.count,
      page,
      limit,
    });
  });
};
