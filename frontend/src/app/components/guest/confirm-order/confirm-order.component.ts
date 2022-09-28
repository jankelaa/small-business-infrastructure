import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  pib1: string;
  order: ProductForOrder[];

  pib2: string;
  secretCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  postcode: string;

  message = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('order'));
  }

  createOrder() {
    this.orderService.createOrder(this.pib1, this.secretCode, this.order).subscribe({
        next: () => {
          this.message = null;
          alert('Narudžbina kreirana!');
        },
        error: (error: HttpErrorResponse) => {
          this.message = error.error;
        }
      })
  }

  customerSignupAndOrder() {
    this.orderService.customerSignupAndOrder(this.name, this.pib2, this.email, this.phone,
      this.address, this.country, this.city, this.postcode).subscribe({
        next: () => {
          this.message = null;
          alert('Narudžbina kreirana!');
        },
        error: (error: HttpErrorResponse) => {
          this.message = error.error;
        }
      })
  }
}
