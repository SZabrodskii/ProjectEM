export class StockDto {
  productId: number;
  quantity: number;

  constructor(productId: number, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

export class StockUpdateDto {
  productId: number;
  quantityChange: number;
  shopId: number;

  constructor(productId: number, quantityChange: number, shopId: number) {
    this.productId = productId;
    this.quantityChange = quantityChange;
    this.shopId = shopId;
  }
}
