import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-invalid-route',
  templateUrl: './invalid-route.component.html',
  styleUrls: ['./invalid-route.component.css']
})
export class InvalidRouteComponent implements OnInit {

  loggedUser: User;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));

    if (this.loggedUser == null) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/employee']);
    }
  }

}
