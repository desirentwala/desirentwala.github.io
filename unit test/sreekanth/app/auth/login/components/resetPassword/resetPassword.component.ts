import { UtilsService } from './../../../../core/ui-components/utils/utils.service';
import { Logger } from './../../../../core/ui-components/logger/logger';
import { ConfigService } from './../../../../core/services/config.service';
import { Router } from '@angular/router';
import { LoginValidator } from './../login/login.validator';
import { LoginFormModel } from './../../model/login-model';
import { UserService } from './../../services/user/user.service';
import { SharedModule } from './../../../../core/shared/shared.module';
import { AllUiComponents } from './../../../../core/ui-components/all.uicomponents.module';
import { ModalModule } from './../../../../core/ui-components/modal/index';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnInit, Component, NgModule, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'reset-password',
  templateUrl: './resetPassword.template.html'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  utils: UtilsService;
  router: Router;
  userService: UserService;
  acceptPassword: string;
  passwordMatch = true;
  isError = false;
  isModalError = false;
  errors = [];
  modalErrors = [];
  inputobject;
  success = false;
  mousedown = false;
  isPasswordIcon = false;
  resretPassword = true;

  constructor(_userService: UserService,
    _router: Router, loginFormModel: LoginFormModel,
    public config: ConfigService, public _logger: Logger,
    loginValidator: LoginValidator,
    _utils: UtilsService, public changeRef: ChangeDetectorRef) {
    this.resetPasswordForm = loginFormModel.getResetPasswordFormModel();
    this.resetPasswordForm = loginValidator.setResetPasswordValidator(this.resetPasswordForm);
    this.utils = _utils;
    this.userService = _userService;
    this.router = _router;
  }

  ngOnInit() {
    if (!this.config.getCustom('userid') || !this.config.getCustom('recoverystring')) {
      this.config.navigateRouterLink('Login');
      this.config.setLoadingSub('no');
      window.location.reload();
    } else {
      this.inputobject = { user_id: this.config.getCustom('userid'), passwordRecoveryString: this.config.getCustom('recoverystring') };
    }
  }

  changePassword(passwordFormValue?) {
    let input = [];
    this.inputobject.user_password = passwordFormValue.user_password
    this.inputobject.confirm_password = passwordFormValue.passwordFormValue
    input.push(this.inputobject)
    let responseArray: any[] = this.utils.checkUserPassword(input[0]);
    if (responseArray.length > 1) {
      this.config.setLoadingSub('no');
      this.isModalError = true;
      this.modalErrors = [];
      for (let i = 1; i < responseArray.length; i++) {
        this.modalErrors.push({ 'errCode': responseArray[i].errCode, 'errDesc': responseArray[i].errDesc });
      }
    } else {
      let inputJSON = [{ 'user_id': input[0].user_id, 'salt': '', 'oneTimeSalt': '' }];
      let oneTimeSalt = this.config.ncpRestServiceCall('idmServices/getOneTimeSalt', inputJSON);
      oneTimeSalt.subscribe(
        (oneTimeSaltResp: any) => {
          if (oneTimeSaltResp.oneTimeSalt) {
            let hashedUserPassword = this.utils.doHashValue(oneTimeSaltResp.oneTimeSalt + input[0].user_password);
            input[0].user_password = hashedUserPassword;
            input[0].confirm_password = hashedUserPassword;
            let resp = this.config.ncpRestServiceCall('idmServices/validateRecoveryLink', input);
            resp.subscribe(
              (data: any) => {
                if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                  this.config.setLoadingSub('no');
                  this.isModalError = true;
                  this.modalErrors = [];
                  for (let i = 1; i < data.error.length; i++) {
                    this.modalErrors.push({ 'errCode': data.error[i].errCode, 'errDesc': data.error[i].errDesc });
                  }
                } else {
                  this.isModalError = false;
                  this.config.setLoadingSub('no');
                  this.success = true;
                  this.resetPasswordForm.disable();
                  this.changeRef.markForCheck();
                }
              },
              (error) => {
                this.doErrorHandler(error);
              }
            );
          }
        },
        (error) => {
          this.doErrorHandler(error);
        }
      );
    }
  }

  passwordStrength(event: any) {
    let value;
    value = event instanceof Object ? event.target.value : event;
    this.acceptPassword = value;
  }

  passwordMismatch() {
    if (this.resetPasswordForm.value.user_password !== this.resetPasswordForm.value.confirm_password) {
      this.passwordMatch = false;
    } else {
      this.passwordMatch = true;
    }
  }

  redirectToLogin() {  
    location.replace(this.config.get('resetPasswordExternalRedirectUrl'));
  }

  doErrorHandler(error) {
    this.config.setLoadingSub('no');
    this.isError = true;
    this.errors = [];
    this.errors.push({ 'errDesc': 'Server Error' });
    this._logger.error('URL Error:===>' + error);
  }

}

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalModule, AllUiComponents, SharedModule],
  exports: [ResetPasswordComponent],
  providers: [UserService, LoginFormModel, LoginValidator, Logger]
})

export class ResetPasswordModule { }
