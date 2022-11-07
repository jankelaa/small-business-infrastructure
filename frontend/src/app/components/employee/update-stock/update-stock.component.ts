import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-update-stock',
  templateUrl: './update-stock.component.html',
  styleUrls: ['./update-stock.component.css']
})
export class UpdateStockComponent implements OnInit {

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  selectedFile: File = null;
  message: string = null;

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

  updateStock() {
    if (this.selectedFile == null) return;
    const fd = new FormData();
    fd.append('file', this.selectedFile);

    this.productService.updateStock(fd).subscribe({
      next: () => {
        this.message = 'Učitavanje je uspešno izvršeno, možete učitati novi fajl.';
        this.selectedFile = null;
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    })
  }
}
