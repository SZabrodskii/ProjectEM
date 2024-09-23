export type ProductDto = {
  name: string;
  description: string;
  price: number;
}

export type ProductFilterDto = {
  minPrice?: number;
  maxPrice?: number;
  name?: string;
}
