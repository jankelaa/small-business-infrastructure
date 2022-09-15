import { Component, OnInit } from '@angular/core';
import { ProductForOrder } from 'src/app/model/product-for-order.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  order: ProductForOrder[];

  constructor() { }

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('order'));
  }

}
