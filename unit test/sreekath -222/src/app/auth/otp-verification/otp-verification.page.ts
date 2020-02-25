import { Component, OnInit, ViewChildren, QueryList, HostListener, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { TokenValidaterService } from 'src/app/common/services/token-validater.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {
  @ViewChild(NgForm, {static: false}) ngForm: NgForm;
  Otp: number;
  otpInput = [];
  otpOutput;
  timeLeft: number;
  interval: any;
  secretOTP: any;
  decodeSecret: any = '';
  alertbox: boolean;
  verified: boolean;
  model: any = {};

  @ViewChildren('inputs') inputs: QueryList<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private tokenValidatorService: TokenValidaterService,
    private notificationService: NotificationService,
    private alertController: AlertController
    ) {
    /**
     * setting timer to 120
     */
    this.timeLeft = 120;
  }
  isEmpty = false;
  /**
   * @description keycode 8 for backspace otpinput checks condition true or false;
   * @param i index+1 of otpinput array
   * @param keyEvent event of the ion-input
   */

  ngOnInit() {
    this.secretOTP = localStorage.getItem('secret');
    this.callingOTPInterval();
    this.resendotp();
  }
  /**
   * function for verifyotp
   */
  verifyotp() {
    this.decodeSecret = this.tokenValidatorService.getTokenInfo(this.secretOTP);
    if (!this.tokenValidatorService.validateToken && !this.tokenValidatorService.validateToken(this.secretOTP)) {
      const verifyOTP = {
        // otp: +this.otpOutput,
        // secret: this.decodeSecret.sub.secret,
        // userId: this.decodeSecret.sub.userId,
        // exp: this.decodeSecret.exp,
        // email: this.model.email,
        // role: this.decodeSecret.sub.role
      };
      this.authService.verifyOTP(verifyOTP).subscribe(resp => {
          this.verified = true;
          localStorage.removeItem('secret');
          this.router.navigate(['/auth']);
      });
    }
  }

  /**
   * @description calling Otp interval of 120 seconds
   */
  callingOTPInterval(time = 0): void {
    if (!time) {
      this.interval = setInterval(() => {
        if (this.timeLeft !== 0) {
          return this.timeLeft--;
        }
        clearInterval(this.interval);
        if (this.timeLeft === 0 && !this.verified) {
          // this.notificationService.notification('Token expired, please use resend otp');
        }
      }, 1500);
    } else {
      this.timeLeft = time;
      this.interval = setInterval(() => {
        if (this.timeLeft !== 0) {
          return this.timeLeft - 1;
        }
        clearInterval(this.interval);
      }, 1500);
    }
  }


  /**
   * function for resendOTP
   */
  resendotp() {
    this.otpOutput = [];
    this.callingOTPInterval(120);
    let resendOTP = {};
    this.decodeSecret = this.tokenValidatorService.getTokenInfo(this.secretOTP);
    if (this.decodeSecret) {
    //  this.model.email = this.decodeSecret.sub.email;
      //this.model.mobile = this.decodeSecret.sub.mobile;
      resendOTP = {
       // email: this.decodeSecret.sub.email,
        //userId: this.decodeSecret.sub.userId,
      };
    } else if (this.tokenValidatorService.getTokenInfo && this.tokenValidatorService.getTokenInfo(this.decodeSecret)) {
      const sc = this.tokenValidatorService.getTokenInfo(this.decodeSecret);
      this.model.email = sc.email;
      this.model.mobile = sc.mobile;
      resendOTP = {
        email: sc.email,
        userId: sc.userId,
      };
    }
    this.authService.resendotp(resendOTP).subscribe(resp => {
      this.secretOTP = resp.data;
      this.notificationService.notification(resp.message, 'success');
    });
  }
}
