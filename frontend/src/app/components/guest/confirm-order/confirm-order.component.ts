import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerWithAddresses } from 'src/app/model/customer-with-addresses.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  order: ProductForOrder[];

  pib1: string;
  secretCode: string;

  pib2: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  postcode: string;

  customer: CustomerWithAddresses = null;

  step1: boolean;

  selectedAddress: number;
  message = null;

  constructor(private customerService: CustomerService, private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.step1 = false;
    this.order = JSON.parse(localStorage.getItem('order'));

    if (this.order.length === 0) this.router.navigate(['/cart']);
  }

  signin() {
    this.customerService.signin(this.pib1, this.secretCode).subscribe({
      next: (data: { customer: CustomerWithAddresses }) => {
        this.message = null;
        this.customer = data.customer;

        this.customer.addresses.forEach(a => {
          if (a.isMain) this.selectedAddress = a.id
        });

        this.step1 = true;
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }

  signup() {
  }
}
