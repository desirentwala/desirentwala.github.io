import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/common/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenValidaterService } from 'src/app/common/services/token-validater.service';
import { AlertController } from '@ionic/angular';
import { NotificationService } from 'src/app/common/services/notification.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formData: any;
  passwordShow: boolean;
  roleId: string;
  isShowPassword: boolean;
  isShow: boolean;
  confirmPasswordShow: boolean;
  userData: any;
  email: any;
  isDisabled: boolean;

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    private authService: AuthService,
    private tokenValidatorService: TokenValidaterService,
    public alertController: AlertController,
    private notificationService: NotificationService,
    public storage: Storage
  ) {
    localStorage.clear();
    this.signUpFormData();
    this.getRole();
  }

  ionViewWillEnter() {

    this.storage.get('ONBOARD_VET').then((val) => {
      if(val !== null){
        this.email = val.email;
        this.formData.controls['email'].setValue(val.email);
        this.roleId = val.role;
        this.isDisabled = true;
      }
      });
    this.storage.get('ONBOARD_PO').then((petOnwerValue) => {
      if(petOnwerValue !== null){
        this.email = petOnwerValue.email;
        this.formData.controls['email'].setValue(petOnwerValue.email);
        this.roleId = petOnwerValue.role;
        this.isDisabled = true;
        }
      });
     
  }

  ngOnInit() { 
    this.storage.get('ONBOARD_VET').then((val) => {
      if(val !== null){
        this.email = val.email;
        this.formData.controls['email'].setValue(val.email);
        this.roleId = val.role;
        this.isDisabled = true;
      }
      });
    this.storage.get('ONBOARD_PO').then((petOnwerValue) => {
      if(petOnwerValue !== null){
        this.email = petOnwerValue.email;
        this.formData.controls['email'].setValue(petOnwerValue.email);
        this.roleId = petOnwerValue.role;
        this.isDisabled = true;
        }
      });
   }

  /**
   * field's for sign-up form
   */
  signUpFormData() {
    
    this.formData = new FormGroup({
      email: new FormControl(this.email || '', [
        Validators.required,
      ]),
      firstName: new FormControl('', [Validators.required]),

      mobile: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      confirmpassword: new FormControl('', Validators.compose([
        Validators.required
    ])),
    privacyPolicy: new FormControl(false, [
      Validators.requiredTrue
    ]),
    }, {
      validators: this.password.bind(this)
  }
);
  }

  /**
   * to change input type for password
   */
  changePasswordType() {
    this.passwordShow = !this.passwordShow;
  }

  /**
   * to change input type for password
   */
  showConfirmPassword() {
    this.confirmPasswordShow = !this.confirmPasswordShow;
  }

  /**
   * subscription for registration data
   */
  signUpForm() {
    const data = {
      firstName: this.formData.value.firstName,
      email: this.formData.value.email.toLowerCase(),
       // password encryptio
      password: this.authService.encryptPassword(this.formData.value.password,
        this.tokenValidatorService.secretToken()).toString(),
      mobile: this.formData.value.mobile,
      roleId: this.roleId
    };

    this.storage.get('ONBOARD_VET').then((val) => {
      if(val !== null){
        data['type'] = 'ONBOARD_VET';
        this.authService.registerUser(data).subscribe((response: any) => {
          if (this.roleId === 'PA') {
            this.router.navigate(['/auth/practiceregister'], { queryParams: { role: this.roleId} });
          } else if (this.isDisabled && this.roleId === 'VET'){
            this.router.navigate(['/auth/practiceselection']);
          } else {
            // this.storage.clear();
            this.router.navigate(['/auth/otpverification']);
          }
        });
       } else {
        this.authService.registerUser(data).subscribe((response: any) => {
          if (this.roleId === 'PA') {
            this.router.navigate(['/auth/practiceregister'], { queryParams: { role: this.roleId} });
          } else if (this.isDisabled && this.roleId === 'VET'){
            this.router.navigate(['/auth/practiceselection']);
          } else {
            // this.storage.clear();
            this.router.navigate(['/auth/otpverification']);
          }
        });
      }
      });
  }

  /**
   * get role of user who wants to register
   */
  getRole() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params.role) {
        this.roleId = params.role;
      }
    });
  }

  /**
   * Conditional Function for comparing password and confirm password
   * @param formGroup //For getting password and confirm password
   */
    password(formGroup: FormGroup) {
      const { value: password } = formGroup.get('password');
      const { value: confirmPassword } = formGroup.get('confirmpassword');
      return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  /**
   * Toggle method for Password
   */
    togglePasswordFieldType() {
      this.isShowPassword = !this.isShowPassword;
  }

  /**
   * Toggle method for ConfirmPassword
   */
  toggleConfirmPasswordField() {
    this.isShow = !this.isShow;
  }
  /**
   * on close sign up page
   */
  onCloseSignup() {
    this.router.navigateByUrl('/home');
    this.storage.clear();
  }

  
}
