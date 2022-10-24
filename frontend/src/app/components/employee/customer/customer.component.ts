import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerFull } from 'src/app/model/customer-full.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerId: number;
  customer: CustomerFull;

  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    this.customerService.getCustomerById(this.customerId).subscribe((data: { customer: CustomerFull }) => {
      this.customer = data.customer;
      this.customer.rankString = this.customerService.getCustomerRankString(this.customer.rank);
    });
  }

  addPermanentDiscount() {

  }
}
