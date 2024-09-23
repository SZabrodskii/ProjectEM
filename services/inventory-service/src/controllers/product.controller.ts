import {ProductService} from '../services/product.service';
import {FastifyReply, FastifyRequest} from 'fastify';
import {ProductDto, ProductFilterDto} from '../dtos/product.dto';

export class ProductController {
  constructor(private productService: ProductService) {
  }

  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    await this.productService.createProduct(<ProductDto>request.body).then(product => {
      reply.send(product);
    }).catch(error => {
      reply.status(500).send({error: error})
    });
  }

  async getProducts(request: FastifyRequest, reply: FastifyReply) {
    const filters = <ProductFilterDto>request.query;

    try {
      const products = await this.productService.findProducts(filters);

      return reply.send(products);
    } catch (error) {
      return reply.status(500).send({error: 'Failed to get products'});
    }
  }
}
