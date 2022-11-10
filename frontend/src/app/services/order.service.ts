import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';
import { OrderStatuses } from 'src/enums/order-statuses';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllOrders() {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.order}`);
  }

  getIncompleteOrders() {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.order}/incomplete`);
  }

  getFilteredOrders(filterValue: string) {
    const params = {
      filterValue
    }

    return this.httpClient.get(`${this.baseUrl}${ApiPaths.order}/filter`, { params });
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

  approveOrder(orderId: number) {
    const data = {
      orderId
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.order}/approve`, data, { responseType: 'text' });
  }

  completeOrder(orderId: number) {
    const data = {
      orderId
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.order}/complete`, data, { responseType: 'text' });
  }

  cancelOrder(orderId: number) {
    const data = {
      orderId
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.order}/cancel`, data, { responseType: 'text' });
  }

  getOrderWithProducts(orderId: number) {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.order}/${orderId}`);
  }

  getOrderStatuses() {
    return OrderStatuses;
  }

  getStatusString(status: number) {
    return OrderStatuses[status];
  }

  getPaymentStatusString(isPaid: boolean) {
    return isPaid ? 'plaćeno' : 'nije plaćeno'
  }
}
