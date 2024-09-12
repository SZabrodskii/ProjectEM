import { getRepository } from 'typeorm';
import { Stock } from '../models/stock.model';

export class StockService {
  private stockRepository = getRepository(Stock);

  async createStock(stockData: { productId: number; shopId: number; quantityOnShelf: number; quantityInOrder: number }) {
    const stock = this.stockRepository.create(stockData);
    return this.stockRepository.save(stock);
  }

  async changeStock(id: number, amount: number) {
    const stock = await this.stockRepository.findOne({ where: { id } });
    if (!stock) throw new Error('Stock not found');

    stock.quantityOnShelf += amount;
    return this.stockRepository.save(stock);
  }

  async findStocks(filters: { plu?: string; shopId?: number; quantityOnShelfFrom?: number; quantityOnShelfTo?: number; quantityInOrderFrom?: number; quantityInOrderTo?: number }) {
    const query = this.stockRepository.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product');

    if (filters.plu) {
      query.andWhere('product.plu = :plu', { plu: filters.plu });
    }
    if (filters.shopId) {
      query.andWhere('stock.shopId = :shopId', { shopId: filters.shopId });
    }
    if (filters.quantityOnShelfFrom !== undefined && filters.quantityOnShelfTo !== undefined) {
      query.andWhere('stock.quantityOnShelf BETWEEN :from AND :to', { from: filters.quantityOnShelfFrom, to: filters.quantityOnShelfTo });
    }
    if (filters.quantityInOrderFrom !== undefined && filters.quantityInOrderTo !== undefined) {
      query.andWhere('stock.quantityInOrder BETWEEN :from AND :to', { from: filters.quantityInOrderFrom, to: filters.quantityInOrderTo });
    }

    return query.getMany();
  }
}
