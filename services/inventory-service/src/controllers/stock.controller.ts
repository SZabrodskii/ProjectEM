import { FastifyInstance } from 'fastify';
import { StockService } from '../services/stock.service';
import { Stock } from '../models/stock.model';

export function stockRoutes(fastify: FastifyInstance, stockService: StockService) {
    // Создание остатка
    fastify.post('/stocks/create', async (request, reply) => {
        const { plu, shopId, shelfQuantity, orderQuantity } = request.body as {
            plu: string;
            shopId: string;
            shelfQuantity: number;
            orderQuantity: number;
        };
        const stock = await stockService.createStock({ plu, shopId, shelfQuantity, orderQuantity });
        return stock;
    });

    // Увеличение остатка
    fastify.post('/stocks/increase', async (request, reply) => {
        const { plu, shopId, amount } = request.body as {
            plu: string;
            shopId: string;
            amount: number;
        };
        const updatedStock = await stockService.increaseStock(plu, shopId, amount);
        return updatedStock;
    });

    // Уменьшение остатка
    fastify.post('/stocks/decrease', async (request, reply) => {
        const { plu, shopId, amount } = request.body as {
            plu: string;
            shopId: string;
            amount: number;
        };
        const updatedStock = await stockService.decreaseStock(plu, shopId, amount);
        return updatedStock;
    });

    // Получение остатков по фильтрам
    fastify.get('/stocks', async (request, reply) => {
        const { plu, shopId, shelfQuantityFrom, shelfQuantityTo, orderQuantityFrom, orderQuantityTo } = request.query as {
            plu?: string;
            shopId?: string;
            shelfQuantityFrom?: number;
            shelfQuantityTo?: number;
            orderQuantityFrom?: number;
            orderQuantityTo?: number;
        };
        const stocks = await stockService.getStocks({ plu, shopId, shelfQuantityFrom, shelfQuantityTo, orderQuantityFrom, orderQuantityTo });
        return stocks;
    });
}