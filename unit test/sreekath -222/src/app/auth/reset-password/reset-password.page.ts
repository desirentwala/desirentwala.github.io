import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../common/services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenValidaterService } from '../../common/services/token-validater.service';
import { NotificationService } from '../../common/services/notification.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
    loginForm: FormGroup;
    isShowPassword: boolean;
    isShow: boolean;
    randomId: any;
    userId: any;

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public formBuilder: FormBuilder,
        public alertController: AlertController,
        private notificationService: NotificationService,
        private tokenValidatorService: TokenValidaterService) {
        this.initFormBuilder();
        this.getResetQueryParams();
    }

    ngOnInit() { }

    /**
     * Validations for Password and ConfirmPassword
     */
    initFormBuilder(): void {
        this.loginForm = this.formBuilder.group({
            password: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20)
            ])),
            confirmpassword: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20)
            ])),
        }, {
            validators: this.password.bind(this)
        });
    }


    /**
     * Function for ResetPassword
     */
    resetPassword() {
        const resetObj = {
            password: this.authService.encryptPassword(this.loginForm.value.password,
                this.tokenValidatorService.secretToken()).toString()
        };
        this.authService.resetPassword(resetObj, this.userId.sub).subscribe((response) => {
            this.notificationService.notification('Password reset done, please login!' , 'success');
            this.router.navigateByUrl('/auth');
        });
    }

    /**
     * Function for assing the QueryParams
     */
    getResetQueryParams(): any {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.q) {
                if (!this.tokenValidatorService.validateToken(params.q)) {
                    this.userId = this.tokenValidatorService.getTokenInfo(params.q);
                } else {
                    this.notificationService.notification('Token Expired', 'danger');
                    this.router.navigateByUrl('/auth');
                }
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
}
