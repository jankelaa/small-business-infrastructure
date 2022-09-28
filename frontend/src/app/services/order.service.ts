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



  createOrder(pib, secretCode, order) {
    const data = {
      pib,
      secretCode,
      order
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.order}/create/customer`, data);
  }
}
