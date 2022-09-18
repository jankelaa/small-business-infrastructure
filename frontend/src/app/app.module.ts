import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductComponent } from './components/product/product.component';
import { CustomerComponent } from './components/customer/customer.component';
import { OrderComponent } from './components/order/order.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    CustomerComponent,
    OrderComponent,
    HeaderComponent,
    ProductsListComponent,
    LoginComponent,
    EmployeeComponent,
    HomeComponent,
    RegisterComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
