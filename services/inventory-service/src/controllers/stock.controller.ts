import { FastifyRequest, FastifyReply } from 'fastify';
import { StockService } from '../services/stock.service';
import { Buffer } from 'buffer'
import {StockDto, StockUpdateDto} from "../dtos/stock.dto";

export class StockController {
  constructor(private stockService: StockService) {}

  async createStock(request: FastifyRequest, reply: FastifyReply) {
    const stockData = <StockDto> request.body;

    try {
      const stock = await this.stockService.createStock(stockData);

      return reply.send(stock);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to create stock' });
    }
  }

  async increaseStock(request: FastifyRequest, reply: FastifyReply) {
    const stockData = <StockUpdateDto> request.body;

    try {
      const updatedStock = await this.stockService.changeStock(stockData);
      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to increase stock' });
    }
  }

  async decreaseStock(request: FastifyRequest, reply: FastifyReply) {
    const stockData = <StockUpdateDto> request.body;

    try {
      const updatedStock = await this.stockService.changeStock(stockData);
      return reply.send(updatedStock);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to decrease stock' });
    }
  }

  async getStocks(request: FastifyRequest, reply: FastifyReply) {
    const filters = request.query;

    try {
      const stocks = await this.stockService.findStocks(filters);
      return reply.send(stocks);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to get stocks' });
    }
  }
}
