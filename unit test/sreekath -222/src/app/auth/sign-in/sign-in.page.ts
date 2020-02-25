import { Component, OnInit, ViewChild } from '@angular/core';
import { SignIn } from './sign-in.model';
import { AuthService } from '../../common/services/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../common/services/common.service';
import { NotificationService } from '../../common/services/notification.service';
import { Storage } from '@ionic/storage';
import { TokenValidaterService } from 'src/app/common/services/token-validater.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage implements OnInit {
  @ViewChild(NgForm, {static: false}) ngForm: NgForm;

  model = new SignIn();
  randomId: any;
  show: boolean;
  isEmail: boolean;
  isName: boolean;
  emailPattern: '^(?!.*\.{2})[a-zA-Z0-9.-_]{1,64}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
  namePattern: '^[a-zA-Z0-9]*$';
  errorMessage: any;
  isPattern: boolean;
  @ViewChild('signInForm', { static: false }) signInForm: NgForm;

  constructor(
    public router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private notificationService: NotificationService,
    public storage: Storage,
    private tokenValidatorService: TokenValidaterService
  ) { }

  ngOnInit() {
    this.init();
  }

  /**
   * initialize for the random salt gereration
   */
  init(): void {
    this.authService.randomSalt().subscribe(res => {
      this.randomId = res.secretSalt;
      this.model.isChecked = false;
    });
    // if user login
    if (this.tokenValidatorService.validateToken(localStorage.getItem('accessToken'))) {
      this.authService.signOut();
    } else if (localStorage.getItem('accessToken') && localStorage.getItem('result')) {
      this.navigateByMlRole();
    }
  }

  /**
   * sign in porcess intiated
   */
  signIn() {
    if(this.model.email !=undefined || this.model.email !=null){
    this.model.email = this.model.email.trim().toLowerCase();
    const modelCopy = Object.assign({}, this.model);

    this.authService.authCheckByEmail(modelCopy).subscribe((res) => {
      if (res.code) {
        localStorage.setItem('secret', res.secret);
        this.router.navigateByUrl('/auth/otpverification');
      } else {
        const ePwd = this.authService.encryptPassword(modelCopy.password, res.secretSalt);
        if (ePwd.toString() === res.data) {
          const authObj = { email: modelCopy.email, password: res.data, isChecked: modelCopy.isChecked };
          this.authService.signIn(authObj, res.secretSalt).subscribe(authRes => {
            if (!authRes.code) {
              this.signInForm.form.reset();
              this.navigateByMlRole();
            } else {
              this.router.navigateByUrl('/auth/otpverification');
            }
          });
        } else {
          this.notificationService.notification('Invalid credentials or status is not valid!', ' danger');
        }
      }

    });
  }}

  /**
   * To manage password input display and mask
   */
  showPassword() {
    this.show = !this.show;
  }

  /**
   * on close sign up page
   */
  onCloseSignup() {
    this.router.navigateByUrl('/home');
  }

  // navigate by role and ml private slot exists
  navigateByMlRole(): void {
    this.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
      if (val && this.commonService.getStorage['userroles.role.roleName'] === 'PO') {
        this.router.navigateByUrl('/pets/appointments?ml=yes');
      } else {
        this.commonService.navigateByRole();
      }
    });
  }
}
