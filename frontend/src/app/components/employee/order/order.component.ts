import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/model/order.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
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
  displayCancelButton: boolean = false;

  message: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    this.orderService.getOrderWithProducts(this.orderId).subscribe((data: { order: Order, productsForOrder: ProductForOrder[] }) => {
      this.order = data.order;
      this.order.statusString = this.orderService.getStatusString(data.order.status);
      this.order.isPaidString = this.orderService.getPaymentStatusString(data.order.isPaid);

      this.productsForOrder = data.productsForOrder;

      if (this.order.status === this.orderStatuses['čeka odobrenje']) {
        this.displayApproveButton = true;
      }

      if (this.order.status !== this.orderStatuses.otkazana && this.order.status !== this.orderStatuses.zatvorena) {
        this.displayCancelButton = true;
      }
    });
  }

  approveOrder() {
    this.orderService.approveOrder(this.orderId).subscribe({
      next: () => {
        this.order.status = this.orderStatuses.odobrena;
        this.displayApproveButton = false;
        location.reload();
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.orderId).subscribe({
      next: () => {
        this.order.status = this.orderStatuses.otkazana;
        this.displayApproveButton = false;
        this.displayCancelButton = false;
        window.location.reload();
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }
}
