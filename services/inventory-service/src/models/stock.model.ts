import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Product} from './product.model';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.id)
  product: Product;

  @Column()
  shopId: number;

  @Column({type: 'int', default: 0})
  quantityOnShelf: number;

  @Column({type: 'int', default: 0})
  quantityInOrder: number;
}
