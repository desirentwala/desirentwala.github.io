import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Routing Module Import
import { PaymentsPageRoutingModule } from './payments-routing.module';

// Pages Import
import { CheckoutPage} from './checkout/checkout.page';
import { SuccessPage } from './success/success.page';
import { CancelPage } from './cancel/cancel.page';
import { PaymentsService} from './payments.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsPageRoutingModule
  ],
  declarations: [CheckoutPage, SuccessPage, CancelPage],
  exports: [CheckoutPage, SuccessPage, CancelPage],
  providers:[PaymentsService]
})
export class PaymentsPageModule {}
