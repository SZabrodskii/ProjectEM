import { FastifyInstance } from 'fastify';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

export function productRoutes(fastify: FastifyInstance, productService: ProductService) {
    fastify.post('/products/create', async (request, reply) => {
        const { plu, name } = request.body as { plu: string; name: string };
        const product = await productService.createProduct({ plu, name });
        return product;
    });

    fastify.get('/products', async (request, reply) => {
        const { name, plu } = request.query as { name?: string; plu?: string };
        const products = await productService.findProducts({ name, plu });
        return products;
    });
}