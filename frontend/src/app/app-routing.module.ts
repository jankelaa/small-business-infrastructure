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

const routes: Routes = [
  {
    path: 'employee', component: EmployeeComponent,
    children: [
      {
        path: 'create-user', component: CreateUserComponent
      },
      {
        path: 'create-customer', component: CreateCustomerComponent
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
        path: 'product-list', component: ProductsListComponent
      },
      {
        path: 'cart', component: CartComponent
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
