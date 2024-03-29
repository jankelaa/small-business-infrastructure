import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { ConfirmOrderComponent } from './components/guest/confirm-order/confirm-order.component';
import { SuccessfulOrderComponent } from './components/guest/successful-order/successful-order.component';
import { AllUsersComponent } from './components/employee/all-users/all-users.component';
import { AllOrdersComponent } from './components/employee/all-orders/all-orders.component';
import { AllProductsComponent } from './components/employee/all-products/all-products.component';
import { AddProductsComponent } from './components/employee/add-products/add-products.component';
import { AllCustomersComponent } from './components/employee/all-customers/all-customers.component';
import { OrderComponent } from './components/employee/order/order.component';
import { CustomerComponent } from './components/employee/customer/customer.component';
import { AddProductDiscountsComponent } from './components/employee/add-product-discounts/add-product-discounts.component';
import { UserComponent } from './components/employee/user/user.component';
import { UpdateStockComponent } from './components/employee/update-stock/update-stock.component';

const routes: Routes = [
  {
    path: 'employee', component: EmployeeComponent,
    children: [
      {
        path: 'all-users', component: AllUsersComponent
      },
      {
        path: 'user/:id', component: UserComponent
      },
      {
        path: 'create-user', component: CreateUserComponent
      },
      {
        path: 'create-customer', component: CreateCustomerComponent
      },
      {
        path: 'all-customers', component: AllCustomersComponent
      },
      {
        path: 'customer/:id', component: CustomerComponent
      },
      {
        path: 'all-orders', component: AllOrdersComponent
      },
      {
        path: 'order/:id', component: OrderComponent
      },
      {
        path: 'all-products', component: AllProductsComponent
      },
      {
        path: 'add-products', component: AddProductsComponent
      },
      {
        path: 'update-stock', component: UpdateStockComponent
      },
      {
        path: 'add-product-discounts', component: AddProductDiscountsComponent
      },
      {
        path: '', component: EmployeeInfoComponent
      }
    ]
  },
  {
    path: '', component: GuestComponent,
    children: [
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'products-list', component: ProductsListComponent
      },
      {
        path: 'cart', component: CartComponent
      },
      {
        path: 'confirm-order', component: ConfirmOrderComponent
      },
      {
        path: 'successful-order', component: SuccessfulOrderComponent
      },
      { path: '', component: HomeComponent }
    ]
  },
  {
    path: '**', component: InvalidRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
