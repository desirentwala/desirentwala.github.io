import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiList } from '../common/services/api-list';
import { map } from 'rxjs/operators';
import { PaymentInfo } from './payment.model';
import { CommonService } from '../common/services/common.service';
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Session } from 'protractor';

declare var stripe;
declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class PaymentsService {
  bookingId: string;
  PaymentDetails: PaymentInfo = new PaymentInfo();
  BookingData: any;
  isMobile: boolean;
  isBrowserClosed = false;
  isSuccessed = false;
  browser: any;
  isIOS: boolean;
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private platform: Platform,
    private router: Router
  ) {
    if (this.platform.is('ios') || this.platform.is('android') && !this.platform.is('mobileweb')) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    if (navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)) {
      this.isIOS = true;
    }

  }

  /** Get the Session id For the Payment Redirect to Stripe
   * @param  {} PaymentDetails contains data for the payment details.
   */
  public getSessionid(PaymentDetails) {
    return this.http.post(`${ApiList.PAYMENT_API.session}`, PaymentDetails)
      .pipe(map((res: any) => res));

  }

  public onSuccess(data) {
    return this.http.post(`${ApiList.PAYMENT_API.success}`, data)
      .pipe(map((res: any) => res));
  }

  /** Transaction Status update
   * @param  {} data
   */
  public updateStatus(data) {
    return this.http.post(`${ApiList.APPOINTMENT_APIS.status}`, data)
      .pipe(map((res: any) => res));
  }


  /**
   * @param  {} sessionid
   */
  public getSessionData(data) {
    return this.http.post(`${ApiList.PAYMENT_API.sessionData}?q=${data.session_id}`, data)
      .pipe(map((res: any) => res));
  }

  /** Pass the Data to Intiate the Payment to Server
   * @param  {} checkoutData Data For the payment Intiate
   */
  onCheckOut(checkoutData) {
    // console.log("checkoutData",checkoutData);
    if(this.commonService.getStorage){
      var email = this.commonService.getStorage.email
    }
    const amoount = (parseInt(checkoutData.price) * 100);
    this.PaymentDetails.firstName = checkoutData.firstName;
    this.PaymentDetails.userId = checkoutData.userId;
    this.PaymentDetails.bookingId = checkoutData.bookingId;
    this.PaymentDetails.customerEmail = email;
    this.PaymentDetails.currency = 'GBP';
    this.PaymentDetails.amount = amoount.toString();
    this.PaymentDetails.image = checkoutData.profilePic;
    this.PaymentDetails.description = `Video Consultation Booking for a ${checkoutData.slot.appointmentType} for ${checkoutData.petName} with ${checkoutData.slot.vet} on ${checkoutData.appointmentDate} at ${checkoutData.slot.startsAt} - INC VAT`;

    this.getSessionid(this.PaymentDetails).subscribe((paymentData) => {
      const that = this;
      // Platform Check for the Andriod / Ios and Open the InAppBrowser Application
      if (this.isMobile) {
        that.isSuccessed = false;
        that.isBrowserClosed = false;
        const url = `https://checkout.stripe.com/pay/${paymentData.id}#fidkdWxOYHwnPyd1blpxYHZxWnFnSH9LPGtVc0x8X0dAYmJxdDZfaGd2YTU1UTRrd2hJM1QnKSd3YGNgd3dgd0p3bGJsayc%2FJ21xcXU%2FKippamZkaW1qdnE%2FMTc1NScpJ2hsYXYnP34nYnBsYSc%2FJzEyNTZnYTA2KGA9PTcoMWZhPShkN2cwKGMzZjQ3MGdnMmYzNScpJ2hwbGEnPydkM2NmNTU8YSg3N2RmKDE3ZzwoPDNhNShgYzJhNGc2PWdjNjUnKSd2bGEnPycxNGA0YDc1MChnPGc1KDE8NDwoZGQ9YShgZDJmMzBjYWcxMGMneCknZ2BxZHYnP15YeCUl`
        const options = 'location=no,hardwareback=no';
        let type = '_blank';
        this.browser = window.cordova.InAppBrowser.open(url, type, options);
        const successUrl = `http://localhost/#/payments/success?session_id=${paymentData.id}`;
        // Inappbrowser Load Start 
        this.browser.addEventListener('loadstart', (event) => {
          if (event.url === successUrl) {
            that.browser.close();
            that.isBrowserClosed = true;
            that.isSuccessed = true;
            if (that.isSuccessed && that.isBrowserClosed) {
              that.router.navigate(['/payments/success'], { queryParams: { session_id: paymentData.id } });
            }
          }
        });

        // InAppBrowser LoadStop
        this.browser.addEventListener('loadstop', (event) => {
          if (event.url === successUrl) {
            that.browser.close();
            that.router.navigate(['/payments/success'], { queryParams: { session_id: paymentData.id } });
          }
        });


        // InAppBrowser Exit
        this.browser.addEventListener('exit', (event) => {
          that.isBrowserClosed = true;
          if (event.type === 'exit' && !that.isSuccessed) {
            that.router.navigate(['/payments/cancel'], { queryParams: { trans_id: checkoutData.bookingId } });
          }
        })

      } else {
        sessionStorage.setItem('TRANS_CANCELLED', checkoutData.bookingId);
        stripe
          .redirectToCheckout({
            sessionId: paymentData.id   // Sessionid to Redirect to Checkout
          }).then(handleResult => {
            // alert(handleResult);
          });
      }
    });
  }


  SetAppoitment(appoitmentData) {
    this.BookingData = appoitmentData;
  }

  getAppoitmentData() {
    return this.BookingData;
  }
}
