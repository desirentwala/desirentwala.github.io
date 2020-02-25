import { B2B2CProductLandingComponent } from './b2b2c.productLanding';
import { B2B2CProductComponent } from './products/b2b2c.product';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', component: B2B2CProductLandingComponent },
  { path: 'productLanding', component: B2B2CProductLandingComponent },
  { path: 'product', component: B2B2CProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class B2b2cRoutingModule { }






