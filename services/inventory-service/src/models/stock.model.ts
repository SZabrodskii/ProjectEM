import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, Index} from 'typeorm';
import { Product } from './product.model';

@Unique(['product', 'shopId'])
@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Product, product => product.plu)
  product: Product;

  @Index()
  @Column()
  shopId: number;

  @Index()
  @Column({ default: 0 })
  quantityOnShelf: number;

  @Column({ default: 0 })
  quantityInOrder: number;
}
