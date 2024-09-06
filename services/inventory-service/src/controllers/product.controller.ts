import { FastifyInstance } from 'fastify';
import { ProductService } from '../services/product.service';
import amqplib from "amqplib";

// export const productRoutes = (fastify: FastifyInstance, productService: ProductService) => {
//     fastify.get('/products', async (request, reply) => {
//         return productService.getProducts();
//     });
//
//     fastify.post('/products', async (request, reply) => {
//         const product = await productService.createProduct(request.body);
//         return product;
//     });
//
// };

export class ProductController {


    constructor(private productService: ProductService, private channel: amqplib.Channel) {
        this.channel.consume('action-history', (msg) => {
            if (msg) {
                const message = msg.content.toString();
                console.log(msg)

            }
        }, { noAck: true });
    }
}