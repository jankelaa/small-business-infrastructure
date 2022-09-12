import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  message = null;


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.userService.login(this.username, this.password).subscribe({
      next: (user: User) => {
        this.message = null;

        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/employee']);
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    });
  }

}
