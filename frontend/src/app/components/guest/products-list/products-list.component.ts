import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/model/category.model';
import { ProductForList } from 'src/app/model/product-for-list.model';
import { ProductForOrder } from 'src/app/model/product-for-order.model';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  allCategories: Category[];
  allProducts: ProductForList[];
  productsToDisplay: ProductForList[];
  productsForOrder: ProductForOrder[] = [];

  displayedColumns: string[] = ['img', 'name', 'size', 'price', 'quantity', 'add'];

  constructor(private productService: ProductService, private categoryService: CategoryService,
    private cartService: CartService) { }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('productsForOrder')) != null) {
      this.productsForOrder = JSON.parse(localStorage.getItem('productsForOrder'));
    }

    this.categoryService.getAllCategories().subscribe((allCategories: Category[]) => {
      this.allCategories = allCategories;
    });

    this.productService.getAllProducts().subscribe((allProducts: ProductForList[]) => {
      this.productsToDisplay = this.allProducts = allProducts;
    });
  }

  addFilter(categoryId: number) {
    this.productsToDisplay = categoryId == null ? this.allProducts : [];

    this.allProducts.forEach(ap => {
      if (ap.categoryId == categoryId) this.productsToDisplay.push(ap);
    });
  }

  addToCart(product: ProductForList) {
    let quantity: number;

    if (isNaN(product.quantity) || product.quantity < 1) quantity = 1;
    else quantity = product.quantity;

    const index = this.productsForOrder.findIndex(pto => pto.id === product.id);
    if (index == -1) {
      this.productsForOrder.push(new ProductForOrder(product, quantity));
    } else {
      this.productsForOrder[index].quantity += quantity;
    }

    product.quantity = null;

    localStorage.removeItem('productsForOrder');
    localStorage.setItem('productsForOrder', JSON.stringify(this.productsForOrder));

    this.cartService.setCartCount(this.productsForOrder.length);
  }
}
