import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  baseUrl = environment.baseUrl;

  loggedUserUpdated = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  loggedUserStatusChange(){
    this.loggedUserUpdated.emit();
  }

  login(username, password) {
    const data = {
      username,
      password
    }

    return this.httpClient.post(`${this.baseUrl}${ApiPaths.authentication}/login`, data);
  }
}
