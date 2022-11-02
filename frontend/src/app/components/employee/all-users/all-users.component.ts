import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  allUsers: User[];

  displayedColumns: string[] = ['username', 'email', 'name', 'surname', 'phone'];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data: { users: User[] }) => {
      this.allUsers = data.users;
    });
  }

  openUser(user: User) {
    this.router.navigate([`employee/user/${user.id}`]);
  }
}
