import { FavoriteService } from './../common/services/favorite.service';
import { ProductDetailsService } from './services/product.service';
import { ProductRoutingModule } from './product.route';
import { ProductComponent } from './product';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/index';
import { ProductDetailsComponent } from './product-details/product-details.component';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule
  ],
  declarations: [ProductComponent, ProductDetailsComponent],
  entryComponents: [ProductComponent, ProductDetailsComponent] 
})
export  class ProductModule { }
