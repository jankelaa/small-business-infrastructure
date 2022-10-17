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

  productsForOrder: ProductForOrder[];
  cartCount: number = 0;
  totalPrice: number = 0;

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.productsForOrder = JSON.parse(localStorage.getItem('productsForOrder'));

    if (this.productsForOrder != null) {
      this.cartCount = this.productsForOrder.length;

      this.productsForOrder.forEach(pfo => {
        this.totalPrice += pfo.price * pfo.quantity;
      })

      this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
    }
  }

  removeItem(product: ProductForOrder) {
    const index = this.productsForOrder.findIndex(o => o.id === product.id);

    if (index != -1) {
      this.productsForOrder.splice(index, 1);
    }

    localStorage.removeItem('productsForOrder');
    localStorage.setItem('productsForOrder', JSON.stringify(this.productsForOrder));

    this.totalPrice = 0;
    this.productsForOrder.forEach(pfo => {
      this.totalPrice += pfo.price * pfo.quantity;
    })

    this.cartCount = this.productsForOrder.length;

    this.cartService.setCartCount(this.cartCount);
  }

  confirmOrder() {
    this.router.navigate(['/confirm-order']);
  }

  editOrder() {
    this.router.navigate(['/products-list']);
  }
}
