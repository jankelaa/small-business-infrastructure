import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductsListComponent } from './components/guest/products-list/products-list.component';
import { LoginComponent } from './components/guest/login/login.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { HomeComponent } from './components/guest/home/home.component';
import { CartComponent } from './components/guest/cart/cart.component';
import { CreateUserComponent } from './components/employee/create-user/create-user.component';
import { CreateCustomerComponent } from './components/employee/create-customer/create-customer.component';
import { EmployeeInfoComponent } from './components/employee/employee-info/employee-info.component';
import { GuestComponent } from './components/guest/guest.component';
import { InvalidRouteComponent } from './components/invalid-route/invalid-route.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductsListComponent,
    LoginComponent,
    EmployeeComponent,
    HomeComponent,
    CartComponent,
    CreateUserComponent,
    CreateCustomerComponent,
    EmployeeInfoComponent,
    GuestComponent,
    InvalidRouteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
