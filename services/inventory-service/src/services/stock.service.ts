// import { getRepository } from 'typeorm';
// import { Stock } from '../models/stock.model';
// import { Product } from '../models/product.model';
//
// export class StockService {
//     private stockRepository = getRepository(Stock);
//     private productRepository = getRepository(Product);
//
//     async createStock(stockData: { plu: string; shopId: string; shelfQuantity: number; orderQuantity: number }) {
//         const product = await this.productRepository.findOne({ where: { plu: stockData.plu } });
//         if (!product) {
//             throw new Error('Product not found');
//         }
//
//         const stock = this.stockRepository.create({
//             ...stockData,
//             product
//         });
//         return this.stockRepository.save(stock);
//     }
//
//     async increaseStock(plu: string, shopId: string, amount: number) {
//         const stock = await this.stockRepository.findOne({ where: { plu, shopId } });
//         if (!stock) {
//             throw new Error('Stock not found');
//         }
//         stock.quantityOnShelf += amount;
//         return this.stockRepository.save(stock);
//     }
//
//     async decreaseStock(plu: string, shopId: string, amount: number) {
//         const stock = await this.stockRepository.findOne({ where: { plu, shopId } });
//         if (!stock) {
//             throw new Error('Stock not found');
//         }
//         stock.quantityOnShelf -= amount;
//         return this.stockRepository.save(stock);
//     }
//
//     async getStocks(filters: { plu?: string; shopId?: string; shelfQuantityFrom?: number; shelfQuantityTo?: number; orderQuantityFrom?: number; orderQuantityTo?: number }) {
//         return this.stockRepository.find({ where: filters });
//     }
// }