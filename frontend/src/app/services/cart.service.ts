import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartNotificationUpdated = new EventEmitter();
  cartNotification: number;

  constructor() { }

  setCartCount(cartCount: number){
    this.cartNotification = cartCount;
    this.cartNotificationUpdated.emit(this.cartNotification);
  }
}
