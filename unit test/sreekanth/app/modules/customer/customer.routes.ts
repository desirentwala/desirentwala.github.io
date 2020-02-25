import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import{ CustomerListComponent } from './customer-list/customer-list.component';
import{ CustomerComponent } from './customer.component';
import{ CustomerFormComponent } from './customer-form/customer-form.component';

const routes: Routes = [
   { path: '', component: CustomerListComponent},
   { path: 'customerList', component: CustomerListComponent},
   { path: 'addCustomer', component: CustomerFormComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class customerRoutingModule { }


