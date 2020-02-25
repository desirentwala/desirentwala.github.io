import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { Captcha } from './Captcha.model';
import { ForgotPassword } from './forgot.model';
import { NotificationService } from '../../common/services/notification.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPage implements OnInit {
  @ViewChild(NgForm, {static: false}) ngForm: NgForm;

  modal = new ForgotPassword();
  emailRegex = /^(?!.*\.{2})[a-zA-Z0-9.-_]{1,64}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
@ViewChild('forgot', {static: false}) forgot: NgForm;
  constructor(
    private authService: AuthService,
    public notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  /**
   * sending email to service api @param email
   */
  submitforgotemail() {
    if(this.modal.email!=undefined || this.modal.email!=null){
    this.modal.email = this.modal.email.trim().toLowerCase();
    const modelCopy = Object.assign({}, this.modal);
    this.authService.forgotPassword(modelCopy).subscribe(
      res => {
        if (res) {
            this.notificationService.notification('Reset password link sent to respective email address' , 'success');
            this.forgot.reset();
            this.router.navigateByUrl('/auth');
        }
      });
  }}

   /**
   * on close sign up page
   */
  onCloseForgot() {
    this.router.navigateByUrl('/auth');
  }
}
