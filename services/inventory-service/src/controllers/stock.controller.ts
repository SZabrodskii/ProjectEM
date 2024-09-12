import { FastifyRequest, FastifyReply } from 'fastify';
import { StockService } from '../services/stock.service';
import amqplib from 'amqplib';
import { Buffer } from 'buffer'

export class StockController {
  constructor(private stockService: StockService, private channel: amqplib.Channel) {}

  async createStock(request: FastifyRequest, reply: FastifyReply) {
    const stockData = request.body as { productId: number; shopId: number; quantityOnShelf: number; quantityInOrder: number };
    try {
      const stock = await this.stockService.createStock(stockData);

      const message = JSON.stringify({ action: 'CREATE_STOCK', stock });
      this.channel.sendToQueue('action-history', Buffer.from(message));

      return reply.send(stock);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to create stock' });
    }
  }

  async increaseStock(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params;
    const { amount } = request.body as { amount: number };
    try {
      const updatedStock = await this.stockService.changeStock(id, amount);

      const message = JSON.stringify({ action: 'INCREASE_STOCK', stockId: id, amount });
      this.channel.sendToQueue('action-history', Buffer.from(message));

      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to increase stock' });
    }
  }

  async decreaseStock(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params;
    const { amount } = request.body as { amount: number };
    try {
      const updatedStock = await this.stockService.changeStock(id, -amount);

      const message = JSON.stringify({ action: 'DECREASE_STOCK', stockId: id, amount });
      this.channel.sendToQueue('action-history', Buffer.from(message));

      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to decrease stock' });
    }
  }

  async getStocks(request: FastifyRequest, reply: FastifyReply) {
    const filters = request.query as { plu?: string; shopId?: number; quantityOnShelfFrom?: number; quantityOnShelfTo?: number; quantityInOrderFrom?: number; quantityInOrderTo?: number };
    try {
      const stocks = await this.stockService.findStocks(filters);
      return reply.send(stocks);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to get stocks' });
    }
  }
}
