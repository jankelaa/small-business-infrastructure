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

  login(username, password) {
    const data = {
      username,
      password
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.authentication}/login`, data);
  }

  register(email, password, name, surname, phone) {
    const data = {
      email,
      password,
      name,
      surname,
      phone
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.user}/create`, data);
  }
}
