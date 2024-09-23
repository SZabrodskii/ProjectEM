export type StockDto = {
  productId: number;
  quantity: number;

}

export type StockUpdateDto = {
  productId: number;
  quantityChange: number;
  shopId: number;


}
