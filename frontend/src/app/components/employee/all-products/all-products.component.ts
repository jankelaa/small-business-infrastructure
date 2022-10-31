import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/model/category.model';
import { ProductForList } from 'src/app/model/product-for-list.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  allCategories: Category[];
  allProducts: ProductForList[];
  productsToDisplay: ProductForList[];

  displayedColumns: string[] = ['img', 'barcode', 'name', 'size', 'price'];

  constructor(private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((allCategories: Category[]) => {
      this.allCategories = allCategories;
    });

    this.productService.getAllProducts().subscribe((allProducts: ProductForList[]) => {
      this.productsToDisplay = this.allProducts = allProducts;
    });;
  }

  addFilter(categoryId: number) {
    this.productsToDisplay = categoryId == null ? this.allProducts : [];

    this.allProducts.forEach(ap => {
      if (ap.categoryId == categoryId) this.productsToDisplay.push(ap);
    });
  }

}
