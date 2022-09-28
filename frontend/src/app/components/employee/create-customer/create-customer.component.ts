import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

  name: string;
  pib: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  postcode: string;

  message = null;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
  }

  createCustomer() {
    this.customerService.createCustomer(this.name, this.pib, this.email, this.phone,
      this.address, this.country, this.city, this.postcode).subscribe({
        next: () => {
          this.message = null;
          alert('Customer added!');
        },
        error: (error: HttpErrorResponse) => {
          this.message = error.error;
        }
      })
  }
}
