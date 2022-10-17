import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerForOrder } from 'src/app/model/customer-for-order.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CartService } from 'src/app/services/cart.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  productsForOrder: ProductForOrder[];
  baseAmount: number = 0;
  pdvAmount: number = 0;
  totalAmountWithPdv: number = 0;
  shippingAmount: number = 0;
  shippingAmountWithPdv: number = 0;
  totalPrice: number = 0;

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

  customer: CustomerForOrder = null;

  step1: boolean;

  selectedAddress: number;
  productDiscounts = {};
  message = null;

  constructor(private customerService: CustomerService, private orderService: OrderService,
    private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.step1 = false;
    this.productsForOrder = JSON.parse(localStorage.getItem('productsForOrder'));

    if (this.productsForOrder == null || this.productsForOrder.length === 0) this.router.navigate(['/cart']);
  }

  signin() {
    this.customerService.signin(this.pib1, this.secretCode).subscribe({
      next: (data: { customer: CustomerForOrder }) => {
        this.message = null;
        this.customer = data.customer;

        this.customer.addresses.forEach(a => {
          if (a.isMain) this.selectedAddress = a.id
        });

        this.customer.productDiscounts.forEach(pd => {
          this.productDiscounts[pd.productId] = pd.percentage;
        });

        this.orderCalculations();

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
        next: (data: { customer: CustomerForOrder }) => {
          this.message = null;
          this.customer = data.customer;

          this.customer.addresses.forEach(a => {
            if (a.isMain) this.selectedAddress = a.id
          });

          this.orderCalculations();

          this.step1 = true;
        },
        error: (error: HttpErrorResponse) => {
          this.message = error.error;
        }
      })
  }

  orderCalculations() {
    this.productsForOrder.forEach(pfo => {
      if (this.customer.permanentDiscount != null && this.customer.permanentDiscount > 0) {
        pfo.price -= pfo.price * this.customer.permanentDiscount / 100;
      }

      if (pfo.id in this.productDiscounts) pfo.price -= pfo.price * this.productDiscounts[pfo.id] / 100;

      pfo.price = parseFloat(pfo.price.toFixed(2));

      this.baseAmount += pfo.price;
      this.baseAmount = parseFloat(this.baseAmount.toFixed(2));
    })

    this.pdvAmount = this.baseAmount * environment.PDV / 100;
    this.pdvAmount = parseFloat(this.pdvAmount.toFixed(2));

    this.totalAmountWithPdv = this.baseAmount + this.pdvAmount;
    this.totalAmountWithPdv = parseFloat(this.totalAmountWithPdv.toFixed(2));

    this.shippingAmountWithPdv = this.totalAmountWithPdv * environment.shippingPercent / 100;
    this.shippingAmountWithPdv = parseFloat(this.shippingAmountWithPdv.toFixed(2));

    this.shippingAmount = this.totalAmountWithPdv * (environment.PDV + 100) / 100;
    this.shippingAmount = parseFloat(this.shippingAmount.toFixed(2));

    this.totalPrice = this.totalAmountWithPdv + this.shippingAmountWithPdv;
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }

  confirmOrder() {
    this.orderService.createOrder(this.customer.id, this.baseAmount, this.pdvAmount, this.totalAmountWithPdv,
      this.shippingAmount, this.shippingAmountWithPdv, this.totalPrice, this.selectedAddress, this.productsForOrder)
      .subscribe({
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
