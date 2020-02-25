import { DateDuration } from '../../core/ui-components/ncp-date-picker/index';
import { EnquiryServices, EnquiryServicesImp } from '../common/enquiry/index';
import { customerDetailValidator } from './customer-list/customer-list.validator';
import { customerService } from './services/customer.service';
import { FavoriteModule } from '../common/favorite';
import { EnquiryModule } from './../common/enquiry/enquiry.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CustomerComponent } from './customer.component';
import { customerRoutingModule } from './customer.routes';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CoreModule } from '../../core/index';
import { SharedModule } from './../../core/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    customerRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    EnquiryModule,
    SharedModule,
    FavoriteModule
  ],
  declarations: [CustomerComponent, CustomerListComponent, CustomerFormComponent],
  providers: [customerService, customerDetailValidator, EnquiryServicesImp, EnquiryServices, DateDuration],
  exports: [CustomerComponent, CustomerListComponent, CustomerFormComponent],
  entryComponents: [CustomerListComponent, CustomerFormComponent]
})
export  class CustomerModule { }
