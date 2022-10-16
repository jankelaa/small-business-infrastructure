import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerWithAddresses } from 'src/app/model/customer-with-addresses.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CartService } from 'src/app/services/cart.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  productsForOrder: ProductForOrder[];
  totalPrice: number;

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

  constructor(private customerService: CustomerService, private orderService: OrderService,
    private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.step1 = false;
    this.productsForOrder = JSON.parse(localStorage.getItem('productsForOrder'));

    if (this.productsForOrder == null || this.productsForOrder.length === 0) this.router.navigate(['/cart']);

    this.totalPrice = 0;
    this.productsForOrder.forEach(pfo => {
      this.totalPrice += pfo.price * pfo.quantity;
    })

    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
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
    this.customerService.signup(this.name, this.pib2, this.email, this.phone, this.address, this.country, this.city, this.postcode)
      .subscribe({
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

  confirmOrder() {
    this.orderService.createOrder(this.customer.id, this.totalPrice, this.selectedAddress, this.productsForOrder).subscribe({
      next: () => {
        this.message = null;
        localStorage.removeItem('productsForOrder');
        this.cartService.setCartCount(0);
        this.router.navigate(['/successful-order']);
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }
}
