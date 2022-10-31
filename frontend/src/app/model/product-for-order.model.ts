import { ProductForList } from "./product-for-list.model";

export class ProductForOrder {
  id: number;
  barcode: string;
  name: string;
  imgUrl: string;
  price: number;
  totalPrice: number;
  size: string;
  quantity: number;


  constructor(product: ProductForList, quantity: number) {
    this.id = product.id;
    this.barcode = product.barcode;
    this.name = product.name;
    this.imgUrl = product.imgUrl;
    this.price = product.price;
    this.totalPrice = parseFloat((product.price * quantity).toFixed(2));
    this.size = product.size;
    this.quantity = quantity;
  }
}