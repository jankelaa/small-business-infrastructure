import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;

  admin: boolean = false;
  users: boolean = false;
  customers: boolean = false;
  orders: boolean = false;
  products: boolean = false;

  message = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  createUser() {
    this.userService.createUser(this.email, this.password, this.name, this.surname, this.phone,
      this.admin, this.users, this.customers, this.orders, this.products).subscribe({
        next: () => {
          this.message = null;
          alert('User added!');
        },
        error: (error: HttpErrorResponse) => {
          this.message = error.error;
        }
      })
  }
}
