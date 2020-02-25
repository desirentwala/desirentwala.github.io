import { B2CDashboard } from './b2c.dashboard';
import { ProductLanding } from './b2c.productLanding';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: B2CDashboard },
  { path: 'products', component: ProductLanding }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class B2cRoutingModule { }

