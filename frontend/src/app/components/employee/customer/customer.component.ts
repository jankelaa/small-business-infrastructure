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

  editPermanentDiscount: boolean = false;
  messagePermanentDiscount: string;

  addAddressForm: boolean = false;
  address: string;
  city: string;
  country: string;
  postcode: string;
  messageAddAddress: string;

  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));

    this.customerService.getCustomerById(this.customerId).subscribe((data: { customer: CustomerFull }) => {
      this.customer = data.customer;
      if (this.customer.permanentDiscount == null) this.customer.permanentDiscount = 0;
      this.customer.rankString = this.customerService.getCustomerRankString(this.customer.rank);
    });
  }

  enablePermanentDiscountEdit() {
    this.editPermanentDiscount = true;
  }

  addPermanentDiscount() {
    if (this.customer.permanentDiscount < 1 || this.customer.permanentDiscount > 100) {
      this.messagePermanentDiscount = "Rabat mora biti vrednost između 1 i 100 %";
      return;
    }

    this.customerService.addPermanentDiscountForCustomer(this.customer.id, this.customer.permanentDiscount).subscribe(() => {
      window.location.reload();
    });
  }

  enableAddAddressForm() {
    this.addAddressForm = true;
  }

  addAddress() {
    if (this.address == null || this.city == null || this.country == null || this.postcode == null
      || this.address == "" || this.city == "" || this.country == "" || this.postcode == "") {
      this.messageAddAddress = "Sva polja su obavezna.";
      return;
    }

    this.customerService.addAddressForCustomer(this.customer.id, this.address, this.city, this.country, this.postcode).subscribe(() => {
      window.location.reload();
    });
  }
}
