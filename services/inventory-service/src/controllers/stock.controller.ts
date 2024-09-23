import { FastifyRequest, FastifyReply } from 'fastify';
import { StockService } from '../services/stock.service';
import { StockDto, StockUpdateDto } from '../dtos/stock.dto';

export class StockController {
  constructor(private stockService: StockService) {}

  async createStock(request: FastifyRequest, reply: FastifyReply) {
    await this.stockService.createStock(<StockDto>request.body).then(stock => {
      reply.send(stock);
    }).catch(error => {
      reply.status(500).send({error: error})
    });
  }

  async increaseStock(request: FastifyRequest, reply: FastifyReply) {
    const stockData = <StockUpdateDto> request.body;

    try {
      const updatedStock = await this.stockService.increaseStock(stockData);
      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: error.message || 'Failed to increase stock' });
    }
  }

  async decreaseStock(request: FastifyRequest, reply: FastifyReply) {
    const stockData = <StockUpdateDto> request.body;

    try {
      const updatedStock = await this.stockService.decreaseStock(stockData);
      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: error.message || 'Failed to decrease stock' });
    }
  }

  async getStocks(request: FastifyRequest, reply: FastifyReply) {
    const filters = request.query as any;

    try {
      const stocks = await this.stockService.getStocks(filters);

      return reply.send(stocks);
    } catch (error) {
      request.log.error(request);
      return reply.status(500).send({ error: 'Failed to get stocks' });
    }
  }
}


