import { DataSource } from 'typeorm';
import { ProductDto, ProductFilterDto } from '../dtos/product.dto';
import { Product } from '../models/product.model';

export class ProductService {
  constructor(private dataSource: DataSource) {}

  async createProduct(productData: ProductDto): Promise<Product> {
    const productRepo = this.dataSource.getRepository(Product);
    const newProduct = productRepo.create(productData);
    return await productRepo.save(newProduct);
  }

  async findProducts(filters: ProductFilterDto): Promise<Product[]> {
    const productRepo = this.dataSource.getRepository(Product);

    const query = productRepo.createQueryBuilder('product');

    if (filters.name) {
      query.andWhere('product.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    return await query.getMany();
  }
}
