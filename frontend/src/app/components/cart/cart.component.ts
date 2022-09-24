import { Component, OnInit } from '@angular/core';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  order: ProductForOrder[];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('order'));
  }

  removeItem(product: ProductForOrder) {
    const index = this.order.findIndex(o => o.id === product.id);

    if (index != -1) {
      this.order.splice(index, 1);
    }

    localStorage.removeItem('order');
    localStorage.setItem('order', JSON.stringify(this.order));
    
    this.cartService.setCartCount(this.order.length);
  }

}
