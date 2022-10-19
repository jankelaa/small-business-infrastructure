import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/model/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css']
})
export class AllCustomersComponent implements OnInit {

  allCustomers: Customer[];

  displayedColumns: string[] = ['name', 'pib', 'email', 'rankString'];

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe((data: { customers: Customer[] }) => {
      this.allCustomers = data.customers.map(c => {
        return {
          ...c,
          rankString: this.customerService.getCustomerRankString(c.rank)
        }
      });
    });
  }

  openCustomer(customer: Customer) {
    this.router.navigate([`employee/customer/${customer.id}`]);
  }
}
