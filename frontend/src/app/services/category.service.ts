import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getAllCategories() {
    return this.httpClient.get(`${this.baseUrl}${ApiPaths.category}`);
  }
}
