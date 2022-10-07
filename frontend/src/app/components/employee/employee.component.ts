import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  user: User;

  constructor() { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

}
