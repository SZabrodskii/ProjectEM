import { FastifyInstance } from 'fastify';
import { ProductService } from '../services/product.service';

export const productRoutes = (fastify: FastifyInstance, productService: ProductService) => {
    fastify.get('/products', async (request, reply) => {
        return productService.getProducts();
    });

    fastify.post('/products', async (request, reply) => {
        const product = await productService.createProduct(request.body);
        return product;
    });

};