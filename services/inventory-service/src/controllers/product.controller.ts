import { ProductService } from '../services/product.service';
import { FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import amqplib from 'amqplib';
import { Buffer } from 'buffer'

export class ProductController {
  constructor(private productService: ProductService, private channel: amqplib.Channel) {}

  async createProduct(request: FastifyRequest<{ Body: { plu: string; name: string } }>, reply: FastifyReply) {
    const productData = request.body;
    try {
      const product = await this.productService.createProduct(productData);
      const message = JSON.stringify({ action: 'CREATE_PRODUCT', product });
      this.channel.sendToQueue('action-history', Buffer.from(message));
      return reply.send(product);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to create product' });
    }
  }

  async getProducts(request: FastifyRequest<{ Querystring: { name?: string; plu?: string } }>, reply: FastifyReply) {
    const filters = request.query;
    try {
      const products = await this.productService.findProducts(filters);
      return reply.send(products);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to get products' });
    }
  }


  consumeMessages() {
    this.channel.consume('action-history', (msg) => {
      if (msg) {
        const message = msg.content.toString();
        console.log('Received message:', message);
      }
    }, { noAck: true });
  }
}
