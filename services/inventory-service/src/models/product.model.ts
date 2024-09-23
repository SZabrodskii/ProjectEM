import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  plu: string;

  @Index()
  @Column()
  name: string;
}
