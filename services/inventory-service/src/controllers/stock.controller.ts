import { FastifyRequest, FastifyReply } from 'fastify';
import { StockService } from '../services/stock.service';
import { StockDto, StockUpdateDto } from '../dtos/stock.dto';

export class StockController {
  constructor(private stockService: StockService) {}

  async createStock(request: FastifyRequest<{ Body: StockDto }>, reply: FastifyReply) {
    const stockData = request.body;

    try {
      const stock = await this.stockService.createStock(stockData);
      return reply.send(stock);
    } catch (error) {
      return reply.status(500).send({ error: error.message || 'Failed to create stock' });
    }
  }

  async increaseStock(request: FastifyRequest<{ Body: StockUpdateDto }>, reply: FastifyReply) {
    const stockData = request.body;

    try {
      const updatedStock = await this.stockService.increaseStock(stockData);
      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: error.message || 'Failed to increase stock' });
    }
  }

  async decreaseStock(request: FastifyRequest<{ Body: StockUpdateDto }>, reply: FastifyReply) {
    const stockData = request.body;

    try {
      const updatedStock = await this.stockService.decreaseStock(stockData);
      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: error.message || 'Failed to decrease stock' });
    }
  }

  async getStocks(request: FastifyRequest, reply: FastifyReply) {
    const filters = request.query as any; // или можешь определить интерфейс для фильтров

    try {
      const stocks = await this.stockService.getStocks(filters);
      return reply.send(stocks);
    } catch (error) {
      return reply.status(500).send({ error: error.message || 'Failed to get stocks' });
    }
  }
}


