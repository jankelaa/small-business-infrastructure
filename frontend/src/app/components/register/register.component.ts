import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;

  message = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  register() {
    this.userService.register(this.email, this.password, this.name, this.surname, this.phone).subscribe({
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
