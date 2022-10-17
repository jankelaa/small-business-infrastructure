import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllOrders() {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.order}`);
  }

  customerSignupAndOrder(name, pib, email, phone, address, country, city, postcode) {
    const data = {
      name,
      pib,
      email,
      phone,
      address,
      country,
      city,
      postcode
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.order}/create/signup`, data);
  }

  createOrder(customerId, baseAmount, pdvAmount, totalAmountWithPdv, shippingAmount, shippingAmountWithPdv,
    totalPrice, customerAddressId, productsForOrder) {
    const data = {
      customerId,
      baseAmount,
      pdvAmount,
      totalAmountWithPdv,
      shippingAmount,
      shippingAmountWithPdv,
      totalPrice,
      customerAddressId,
      productsForOrder
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.order}/create`, data);
  }

  getOrderWithProducts(orderId: number) {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.order}/${orderId}`);
  }
}
