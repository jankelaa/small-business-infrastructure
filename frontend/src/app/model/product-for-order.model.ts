import { ProductForList } from "./product-for-list.model";

export class ProductForOrder {
  id: number;
  barcode: string;
  name: string;
  imgUrl: string;
  price: number;
  baseSum: number;
  permanentDiscount: number;
  productDiscount: number;
  totalWithoutPdv: number;
  pdvAmount: number;
  totalPrice: number;
  size: string;
  quantity: number;
  missingQuantity: number;


  constructor(product: ProductForList, quantity: number) {
    this.id = product.id;
    this.barcode = product.barcode;
    this.name = product.name;
    this.imgUrl = product.imgUrl;
    this.price = product.price;
    this.baseSum = parseFloat((product.price * quantity).toFixed(2));
    this.permanentDiscount = 0;
    this.productDiscount = 0;
    this.totalWithoutPdv = 0;
    this.pdvAmount = 0;
    this.totalPrice = 0;
    this.size = product.size;
    this.quantity = quantity;
  }
}