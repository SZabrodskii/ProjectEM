import { DataSource } from 'typeorm';
import { Stock } from '../models/stock.model';
import { StockDto, StockUpdateDto } from '../dtos/stock.dto';
import {Product} from "../models/product.model";

export class StockService {
  constructor(private dataSource: DataSource) {}

  async createStock(stockData: StockDto): Promise<Stock> {
    const stockRepo = this.dataSource.getRepository(Stock);
    const productRepo = this.dataSource.getRepository(Product);
    const product = await productRepo.findOne({ where: { id: stockData.productId } });
    if (!product) {
      throw new Error('Product not found');
    }
    const newStock = stockRepo.create({
      product,
      quantityOnShelf: stockData.quantity,
    });
    return await stockRepo.save(newStock);
  }

  async increaseStock(stockUpdateData: StockUpdateDto): Promise<Stock> {
    const stockRepo = this.dataSource.getRepository(Stock);

    const stock = await stockRepo.findOne({
      where: {
        shopId: stockUpdateData.shopId,
      },
      relations: ['product'],
    });

    if (stock && stock.product && stock.product.id === stockUpdateData.productId) {
      stock.quantityOnShelf += stockUpdateData.quantityChange;
      return await stockRepo.save(stock);
    } else {
      throw new Error('Stock not found');
    }
  }

  async decreaseStock(stockUpdateData: StockUpdateDto): Promise<Stock> {
    const stockRepo = this.dataSource.getRepository(Stock);

    const stock = await stockRepo.findOne({
      where: {
        shopId: stockUpdateData.shopId,
      },
      relations: ['product'],
    });

    if (stock && stock.product && stock.product.id === stockUpdateData.productId) {
      if (stock.quantityOnShelf >= stockUpdateData.quantityChange) {
        stock.quantityOnShelf -= stockUpdateData.quantityChange;
        return await stockRepo.save(stock);
      } else {
        throw new Error('Insufficient stock');
      }
    } else {
      throw new Error('Stock not found');
    }
  }

  async getStocks(filters: { productPlu?: string; shopId?: number; quantityOnShelfMin?: number; quantityOnShelfMax?: number; quantityInOrderMin?: number; quantityInOrderMax?: number }): Promise<Stock[]> {
    const stockRepo = this.dataSource.getRepository(Stock);
    const query = stockRepo.createQueryBuilder('stock');

    if (filters.productPlu) {
      query.andWhere('stock.productPlu = :productPlu', { productPlu: filters.productPlu });
    }
    if (filters.shopId) {
      query.andWhere('stock.shopId = :shopId', { shopId: filters.shopId });
    }
    if (typeof filters.quantityOnShelfMin !== undefined) {
      query.andWhere('stock.quantityOnShelf >= :quantityOnShelfMin', { quantityOnShelfMin: filters.quantityOnShelfMin });
    }
    if (typeof filters.quantityOnShelfMax !== undefined) {
      query.andWhere('stock.quantityOnShelf <= :quantityOnShelfMax', { quantityOnShelfMax: filters.quantityOnShelfMax });
    }
    if (typeof filters.quantityInOrderMin !== undefined) {
      query.andWhere('stock.quantityInOrder >= :quantityInOrderMin', { quantityInOrderMin: filters.quantityInOrderMin });
    }
    if (typeof filters.quantityInOrderMax !== undefined) {
      query.andWhere('stock.quantityInOrder <= :quantityInOrderMax', { quantityInOrderMax: filters.quantityInOrderMax });
    }

    return await query.getMany();
  }
}
