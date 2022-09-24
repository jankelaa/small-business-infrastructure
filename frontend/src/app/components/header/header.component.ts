import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cart_count: number;

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartNotificationUpdated.subscribe(
      cartNotification => this.cart_count = cartNotification
    )
  }

  login() {
    this.router.navigate(['/login']);
  }

}
