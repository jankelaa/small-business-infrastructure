import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  createCustomer(name, pib, email, phone, address, country, city, postcode) {
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

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.customer}/create`, data);
  }
}
