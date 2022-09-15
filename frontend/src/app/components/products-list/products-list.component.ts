import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  allCategories: Category[];
  allProducts: ProductForOrder[];
  productsToOrder: ProductForOrder[];

  filter = null;

  constructor(private productService: ProductService, private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((allCategories: Category[]) => {
      this.allCategories = allCategories;
    });

    this.productService.getAllProducts().subscribe((allProducts: ProductForOrder[]) => {
      this.allProducts = allProducts;
    });;
  }

  addFilter(categoryId: number) {
    this.filter = categoryId;
  }

  addToCart(product: ProductForOrder) {
    const index = this.productsToOrder.findIndex(pto => pto.id === product.id);
    if (index == -1) {
      this.productsToOrder.push(product);
    } else {
      this.productsToOrder[index].quantity += product.quantity;
    }
  }

  order() {
    localStorage.setItem('order', JSON.stringify(this.productsToOrder));
    this.router.navigate(['/cart']);
  }
}
