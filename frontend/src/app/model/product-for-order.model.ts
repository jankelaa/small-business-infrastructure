import { ProductForList } from "./product-for-list.model";

export class ProductForOrder{
    id: number;
    name: string;
    imgUrl: string;
    price: number;
    size: string;
    quantity: number;

    
  constructor(product: ProductForList) {
    this.id = product.id;
    this.name = product.name;
    this.imgUrl = product.imgUrl;
    this.price = product.price;
    this.size = product.size;
    this.quantity = product.quantity;
  }
}