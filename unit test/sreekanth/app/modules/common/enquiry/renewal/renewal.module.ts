import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../../../core/ncpapp.core.module';
import { OrderBy } from '../../../../core/ui-components/table-filter/pipes/orderBy';
import { RenewalService } from '../../../transaction/services/renewal.service';
import { SharedModule } from './../../../../core/shared/shared.module';
import { ENQUIRY_SERVICES } from './../index';
import { RenewalEnquiryComponent } from './renewalEnquiry';

@NgModule({
    imports: [CommonModule, SharedModule, ReactiveFormsModule,CoreModule],
    exports: [RenewalEnquiryComponent],
    declarations: [RenewalEnquiryComponent],
    providers: [OrderBy, RenewalService, ENQUIRY_SERVICES]
})
export class RenewalModule { }