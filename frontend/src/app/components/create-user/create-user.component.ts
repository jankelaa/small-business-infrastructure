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

  message = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  createUser() {
    this.userService.createUser(this.email, this.password, this.name, this.surname, this.phone).subscribe({
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
