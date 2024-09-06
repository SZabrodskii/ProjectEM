import { getRepository } from 'typeorm';
import { Product } from '../models/product.model';

export class ProductService {
    private productRepository = getRepository(Product);

    async createProduct(productData: { plu: string; name: string }) {
        const product = this.productRepository.create(productData);
        return this.productRepository.save(product);
    }

    async findProducts(filters: { name?: string; plu?: string }) {
        return this.productRepository.find({ where: filters });
    }

    async getProducts() {
        return this.productRepository.find();
    }

    async processMessage(message: string) {
        // Process the message received from RabbitMQ
        // Example: Log the message or update database records based on message content
        console.log(`Processing product message: ${message}`);
    }
}