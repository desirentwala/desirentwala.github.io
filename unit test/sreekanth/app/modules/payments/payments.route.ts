import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BatchPaymentComponent } from './batchPayment/batchPayment.component';
import { PaymentHistoryComponent } from './paymentHistory/paymentHistory.component';

const routes: Routes = [
  { path: '', component: BatchPaymentComponent },
  { path: 'batchPayment', component: BatchPaymentComponent },
  { path: 'paymentHistory', component: PaymentHistoryComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule { }



