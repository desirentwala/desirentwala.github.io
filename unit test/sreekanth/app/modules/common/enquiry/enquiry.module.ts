import { NgModule } from '@angular/core';
import { CoreModule } from '../../../core/index';
import { QuoteEnquiryComponent } from '../enquiry/quote/quoteEnquiry';
import { PolicyEnquiryComponent } from './policy/policyEnquiry';
import { ClaimEnquiryComponent } from './claim/claimEnquiry';
import { ENQUIRY_SERVICES } from './index';

import { OrderBy } from '../../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../../core/ui-components/table-filter/pipes/searchBy';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProposalEnquiryComponent } from './proposal/proposalEnquiry';
import { ShareReassignModule } from '../shareReassign';
import { LoaderModule } from '../../../core/ui-components/loader';
@NgModule({
    imports: [CoreModule,CommonModule,ReactiveFormsModule,ShareReassignModule,LoaderModule],
    declarations: [QuoteEnquiryComponent,PolicyEnquiryComponent,ClaimEnquiryComponent,ProposalEnquiryComponent],
    exports: [QuoteEnquiryComponent,PolicyEnquiryComponent,ClaimEnquiryComponent,ProposalEnquiryComponent],
    providers: [ENQUIRY_SERVICES,SearchBy,OrderBy]

})
export class EnquiryModule { }