import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/model/order.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderId: number;
  order: Order;
  productsForOrder: ProductForOrder[];

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    this.orderService.getOrderWithProducts(this.orderId).subscribe((data: { order: Order, productsForOrder: ProductForOrder[] }) => {
      this.order = data.order;
      this.productsForOrder = data.productsForOrder;
    });
  }

  approveOrder() {
    
  }
}
