import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  order: ProductForOrder[];
  total: number;

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('order'));

    this.total = 0;
    this.order.forEach(o => {
      this.total += o.price * o.quantity;
    })
  }

  removeItem(product: ProductForOrder) {
    const index = this.order.findIndex(o => o.id === product.id);

    if (index != -1) {
      this.order.splice(index, 1);
    }

    localStorage.removeItem('order');
    localStorage.setItem('order', JSON.stringify(this.order));

    this.total = 0;
    this.order.forEach(o => {
      this.total += o.price * o.quantity;
    })

    this.cartService.setCartCount(this.order.length);
  }

  confirmOrder() {
    this.router.navigate(['/confirm-order']);
  }

  editOrder() {
    this.router.navigate(['/product-list']);
  }
}
