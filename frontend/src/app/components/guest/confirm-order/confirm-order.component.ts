import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerForOrder } from 'src/app/model/customer-for-order.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CartService } from 'src/app/services/cart.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { environment } from '../../../../environments/environment';
import { DecimalPipe, formatNumber } from '@angular/common';

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
      pfo.totalWithoutPdv = pfo.baseSum;

      if (this.customer.permanentDiscount != null && this.customer.permanentDiscount > 0) {
        pfo.permanentDiscount = pfo.baseSum * this.customer.permanentDiscount / 100;
        pfo.permanentDiscount = this.roundToTwoDecimals(pfo.permanentDiscount);

        pfo.totalWithoutPdv -= pfo.permanentDiscount;
      }

      if (pfo.id in this.productDiscounts) {
        pfo.productDiscount = pfo.baseSum * this.productDiscounts[pfo.id] / 100;
        pfo.productDiscount = this.roundToTwoDecimals(pfo.productDiscount);

        pfo.totalWithoutPdv -= pfo.permanentDiscount;
      }

      pfo.pdvAmount = pfo.totalWithoutPdv * environment.PDV / 100;
      pfo.pdvAmount = this.roundToTwoDecimals(pfo.pdvAmount);

      pfo.totalPrice = pfo.totalWithoutPdv + pfo.pdvAmount;

      this.baseAmount += pfo.totalWithoutPdv;
      this.pdvAmount += pfo.pdvAmount;
    });

    this.totalAmountWithPdv = this.baseAmount + this.pdvAmount;

    this.shippingAmountWithPdv = this.totalAmountWithPdv * environment.shippingPercent / 100;
    this.shippingAmountWithPdv = this.roundToTwoDecimals(this.shippingAmountWithPdv);

    this.shippingAmount = this.shippingAmountWithPdv / (environment.PDV + 100) * 100;
    this.shippingAmount = this.roundToTwoDecimals(this.shippingAmount);

    this.totalPrice = this.totalAmountWithPdv + this.shippingAmountWithPdv;
  }

  createOrder() {
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

  roundToTwoDecimals(value: number) {
    return Math.round(value * 100) / 100;
  }
}
