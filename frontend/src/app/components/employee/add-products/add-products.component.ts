import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  selectedFile: File = null;
  message: string = null;

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

  uploadProducts() {
    if (this.selectedFile == null) return;
    const fd = new FormData();
    fd.append('file', this.selectedFile);

    this.productService.updateProducts(fd).subscribe({
      next: () => {
        this.message = 'Učitavanje je uspešno izvršeno, možete učitati novi fajl.';
        this.selectedFile = null;
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
        console.log(this.message);
      }
    }
    )
  }
}
