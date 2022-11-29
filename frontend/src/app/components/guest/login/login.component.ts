import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('nameRef') nameElementRef: ElementRef;
  username: string;
  password: string;

  message = null;


  constructor(private authorizationService: AuthorizationService, private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.nameElementRef.nativeElement.focus();
  }

  login() {
    this.authorizationService.login(this.username, this.password).subscribe({
      next: (user: User) => {
        this.message = null;

        localStorage.setItem('user', JSON.stringify(user));
        this.authorizationService.loggedUserStatusChange();
        this.router.navigate(['/employee']);
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error;
      }
    });
  }
}
