import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique} from 'typeorm';
import { Product } from './product.model';

@Unique(['product', 'shopId'])
@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.plu)
  product: Product;

  @Column()
  shopId: number;

  @Column({ default: 0 })
  quantityOnShelf: number;

  @Column({ default: 0 })
  quantityInOrder: number;
}
