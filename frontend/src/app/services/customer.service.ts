import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';
import { CustomerRanks } from 'src/enums/customer-ranks';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllCustomers() {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.customer}`);
  }

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

  signin(pib, secretCode) {
    const data = {
      pib,
      secretCode
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.customer}/signin`, data);
  }

  signup(name, pib, email, phone, address, country, city, postcode) {
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

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.customer}/signup`, data);
  }

  getCustomerRankString(rank: number) {
    return CustomerRanks[rank];
  }
}
