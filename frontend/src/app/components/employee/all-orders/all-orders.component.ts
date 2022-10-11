import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/model/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {

  allOrders: Order[];

  displayedColumns: string[] = ['customer', 'address', 'totalPrice', 'status', 'isPaid', 'createdAt'];

  constructor(private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe((data: { orders: Order[] }) => {
      this.allOrders = data.orders;
    });
  }

  openOrder(order: Order) {
    this.router.navigate([`employee/order/${order.id}`]);
  }
}