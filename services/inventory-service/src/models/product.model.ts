import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plu: string;

  @Column()
  name: string;
}
