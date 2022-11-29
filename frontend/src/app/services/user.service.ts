import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllUsers() {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.user}`);
  }

  getUserById(userId: number) {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.user}/${userId}`);
  }

  createUser(email, password, name, surname, phone, admin, users, customers, orders, products) {
    const data = {
      email,
      password,
      name,
      surname,
      phone,
      admin,
      users,
      customers,
      orders,
      products
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.user}/create`, data);
  }
}
