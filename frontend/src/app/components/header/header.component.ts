import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedUserUpdated = new EventEmitter();
  loggedUser: User;

  cartCount: number;

  constructor(private router: Router, private cartService: CartService, private authorizationService: AuthorizationService) {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));

    if (JSON.parse(localStorage.getItem('productsForOrder')) == null) {
    this.cartCount = 0;
    } else {
      this.cartCount = JSON.parse(localStorage.getItem('productsForOrder')).length;
    }
  }

  ngOnInit(): void {
    this.authorizationService.loggedUserUpdated.subscribe(
      () => this.loggedUser = JSON.parse(localStorage.getItem('user'))
    )

    this.cartService.cartNotificationUpdated.subscribe(
      cartNotification => this.cartCount = cartNotification
    )
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('user');
    this.authorizationService.loggedUserStatusChange();
    this.router.navigate(['/']);
  }
}
