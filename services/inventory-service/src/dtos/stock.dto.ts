import {Product} from "../models/product.model";

export class StockDto {
  id: number;
  product: Product
  shopId: number;
  quantityOnShelf: number;
  quantityInOrder: number;
}

export class StockUpdateDto {
  id: number;
  amount: number;
}
