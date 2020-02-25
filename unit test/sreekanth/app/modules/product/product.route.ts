import { NgModule } from '@angular/core';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductComponent } from './product';
import { Routes, RouterModule } from '@angular/router'; 

const routes: Routes = [
       { path: '', component: ProductComponent},
       { path: 'productDetails', component: ProductDetailsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
