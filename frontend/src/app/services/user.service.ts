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

  createUser(email, password, name, surname, phone) {
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
