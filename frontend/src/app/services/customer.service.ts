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

  getCustomerById(customerId: number) {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.customer}/${customerId}`);
  }

  getFilteredCustomers(filterValue: string) {
    const params = {
      filterValue
    }

    return this.httpClient.get(`${this.baseUrl}${ApiPaths.customer}/filter`, { params });
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

  addPermanentDiscountForCustomer(customerId: number, percentage: number) {
    const data = {
      customerId,
      percentage
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.customer}/discount/permanent`, data);
  }

  addAddressForCustomer(customerId: number, address: string, city: string, country: string, postcode: string) {
    const data = {
      customerId,
      address,
      city,
      country,
      zipCode: postcode
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.customer}/address`, data);
  }
}
