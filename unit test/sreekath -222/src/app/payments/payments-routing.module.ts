import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutPage } from './checkout/checkout.page';
import {SuccessPage} from './success/success.page';
import {CancelPage} from './cancel/cancel.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  },
  {
    path: 'checkout',
    component: CheckoutPage
  },
  {
    path: 'success',
    component: SuccessPage
  },
  {
    path: 'cancel',
    component: CancelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsPageRoutingModule {}
