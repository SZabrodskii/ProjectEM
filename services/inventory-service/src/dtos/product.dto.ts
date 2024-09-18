export class ProductDto {
  name: string;
  description: string;
  price: number;

  constructor(name: string, description: string, price: number) {
    this.name = name;
    this.description = description;
    this.price = price;
  }
}

export class ProductFilterDto {
  minPrice?: number;
  maxPrice?: number;
  name?: string;
}
