import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/ncpapp.core.module';
import { SharedModule } from '../../core/shared/shared.module';
import { UiMiscModule } from '../../core/ui-components/misc-element/misc.component';
import { BatchPaymentComponent } from './batchPayment/batchPayment.component';
import { PaymentsRoutingModule } from './payments.route';
import { PaymentHistoryComponent } from './paymentHistory/paymentHistory.component';

@NgModule({
  imports: [
    CommonModule, PaymentsRoutingModule, CoreModule, ReactiveFormsModule, SharedModule, UiMiscModule],

  declarations: [BatchPaymentComponent, PaymentHistoryComponent],
  entryComponents: [BatchPaymentComponent, PaymentHistoryComponent]
})
export class PaymentsModule { }
