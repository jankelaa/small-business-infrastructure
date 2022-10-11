import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllProducts() {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.product}`);
  }

  updateProducts(fd: FormData) {
    return this.httpClient.post(`${this.baseUrl}${ApiPaths.product}/update`, fd, { responseType: 'text' });
  }
}
