import { getRepository } from 'typeorm';
import { Product } from '../models/product.model';

export class ProductService {
  private productRepository = getRepository(Product);

  async createProduct(productData: { plu: string; name: string }) {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async findProducts(filters: { name?: string; plu?: string }) {
    const query = this.productRepository.createQueryBuilder('product');

    if (filters.name) {
      query.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.plu) {
      query.andWhere('product.plu = :plu', { plu: filters.plu });
    }

    return query.getMany();
  }

  async getProducts() {
    return this.productRepository.find();
  }
}
