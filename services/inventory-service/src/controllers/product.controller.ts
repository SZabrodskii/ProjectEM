import { ProductService } from '../services/product.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductDto, ProductFilterDto } from '../dtos/product.dto';

export class ProductController {
  constructor(private productService: ProductService) {}

  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    const productData = <ProductDto> request.body;

    try {
      const product = await this.productService.createProduct(productData);
      return reply.send(product);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to create product' });
    }
  }

  async getProducts(request: FastifyRequest, reply: FastifyReply) {
    const filters = <ProductFilterDto> request.query;

    try {
      const products = await this.productService.findProducts(filters);
      return reply.send(products);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to get products' });
    }
  }
}
