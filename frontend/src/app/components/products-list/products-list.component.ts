import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  allProducts: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void { 
    this.productService.getAllProducts().subscribe((allProducts: Product[]) => {
      this.allProducts = allProducts;
    });;
  }

}
