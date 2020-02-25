import { Component, OnInit } from '@angular/core';
import { PaymentInfo } from '../payment.model';
import {PaymentsService} from '../payments.service';
declare var stripe;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  PaymentDetails: PaymentInfo = new PaymentInfo();
  constructor(private paymentsService: PaymentsService) {  
  }

  ngOnInit() {
  }

  /** Function to Redirect to Checkout page for the payment
   * @param  {} checkoutData Contains Amount Currecny, Desciption and Customer Email Id 
   */
  onCheckOut(checkoutData) {
  //   this.PaymentDetails.amount = '202';
  //   this.PaymentDetails.currency = 'GBP';
  //   this.PaymentDetails.description =  'Test 123';
  //   this.PaymentDetails.customerEmail = 'sunil.kumar@agkiya.cloud';
  //   this.paymentsService.setBookingID('20191222GEN');
  //   this.paymentsService.getSessionid(this.PaymentDetails).subscribe((paymentData) => {
  //     stripe
  //     .redirectToCheckout({
  //       sessionId: paymentData.id   // Sessionid to Redirect to Checkout
  //     }).then(handleResult => {
  //         });
  // });
  }

  
}
