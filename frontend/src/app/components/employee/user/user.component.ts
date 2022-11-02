import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userId: number;
  user: User;

  editPermanentDiscount: boolean = false;
  messagePermanentDiscount: string;

  addAddressForm: boolean = false;
  address: string;
  city: string;
  country: string;
  postcode: string;
  messageAddAddress: string;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.userId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    this.userService.getUserById(this.userId).subscribe((data: { user: User }) => {
      this.user = data.user;
    });
  }
}
