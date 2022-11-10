import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/model/order.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderStatuses = this.orderService.getOrderStatuses();

  orderId: number;
  order: Order;
  productsForOrder: ProductForOrder[];

  displayApproveButton: boolean = false;
  displayCompleteButton: boolean = false;
  displayCancelButton: boolean = false;

  message: string;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.orderId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    this.orderService.getOrderWithProducts(this.orderId).subscribe((data: { order: Order, productsForOrder: ProductForOrder[] }) => {
      this.order = data.order;
      this.order.statusString = this.orderService.getStatusString(data.order.status);
      this.order.isPaidString = this.orderService.getPaymentStatusString(data.order.isPaid);

      this.order.customer.rankString = this.customerService.getCustomerRankString(this.order.customer.rank);

      this.productsForOrder = data.productsForOrder;

      if (this.order.status === this.orderStatuses['čeka odobrenje']) {
        this.displayApproveButton = true;
      }

      if (this.order.status === this.orderStatuses['nedovoljno zaliha']) {
        this.displayCompleteButton = true;
      }

      if (this.order.status !== this.orderStatuses.otkazana && this.order.status !== this.orderStatuses.zatvorena
        && this.order.status !== this.orderStatuses['isporučena']) {
        this.displayCancelButton = true;
      }
    });
  }

  approveOrder() {
    this.orderService.approveOrder(this.orderId).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }

  completeOrder() {
    this.orderService.completeOrder(this.orderId).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.orderId).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }
}
