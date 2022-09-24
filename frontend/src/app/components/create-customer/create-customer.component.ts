import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

  name: string;
  pib: string;
  email: string;
  address: string;
  secretCode: string;

  message = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  createCustomer() {
    this.userService.createUser(this.name, this.pib, this.email, this.address, this.secretCode).subscribe({
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
