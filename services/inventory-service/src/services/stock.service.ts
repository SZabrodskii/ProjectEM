import { DataSource } from 'typeorm';
import { Stock } from '../models/stock.model';
import { StockDto, StockUpdateDto } from '../dtos/stock.dto';

export class StockService {
  constructor(private dataSource: DataSource) {}

  async createStock(stockData: StockDto): Promise<Stock> {
    const stockRepo = this.dataSource.getRepository(Stock);
    const newStock = stockRepo.create(stockData);
    return await stockRepo.save(newStock);
  }

  async changeStock(stockData: StockUpdateDto, type: 'increase' | 'decrease' = 'increase'): Promise<Stock> {
    const stockRepo = this.dataSource.getRepository(Stock);
    const stock = await stockRepo.findOneBy({ productId: stockData.productId });

    if (!stock) {
      throw new Error('Stock not found');
    }

    stock.quantity += (type === 'increase' ? stockData.quantityChange : -stockData.quantityChange);
    return await stockRepo.save(stock);
  }

  async findStocks(): Promise<Stock[]> {
    const stockRepo = this.dataSource.getRepository(Stock);
    return await stockRepo.find();
  }
}
