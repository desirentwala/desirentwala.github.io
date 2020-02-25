import { HttpClient } from '@adapters/packageAdapter';
import { ConfigService } from '../../../../core/services/config.service';
import { EventService } from '../../../../core/services/event.service';
import { AllUiComponents } from '../../../../core/ui-components/all.uicomponents.module';
import { EmailIdvalidators } from './../../../../core/ui-components/validators/emailid/emailid.validator';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { ModalModule } from '../../../../core/ui-components/modal';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { AuthGuard } from '../../../gaurd';
import { LoginFormModel } from '../../model/login-model';
import { UserService } from '../../services/user/user.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { LoginValidator } from './login.validator';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, NgModule, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '@adapters/packageAdapter';
import { TranslateService } from '@adapters/packageAdapter';

declare var Duo: any;
@Component({
  selector: 'login-page',
  templateUrl: './login.template.html'
})
export class LoginComponent implements OnInit, AfterContentInit {
  logoutToken: any;
  _userService: UserService;
  errors = [];
  modalErrors = [];
  isError = false;
  isModalError = false;
  passwordMatch = true;
  createNewUserModal = false;
  enterOTP = false;
  _router;
  loginForm;
  passwordRecoveryForm;
  resetPasswordForm;
  createNewUserFormGroup;
  forgotPasswordOptionsFormGroup;
  enterOTPFormGroup;
  configure: ConfigService;
  forgotPassword = false;
  resretPassword = false;
  forgotPass = false;
  utils: UtilsService;
  loginValidator;
  questions = [];
  brandingJson = [];
  blurFlag = false;
  latestOTP: number;
  forgotPasswordByOTP: boolean = false;
  forgetPasswordOptions: boolean = false;
  forgotPasswordByRecoveryQuestions: boolean = false;
  forgotPasswordBySecAuth: boolean = false;
  masked_user_mobile: string = 'XXXXXXXXXX';
  src: any;
  language;
  isForceLogin: boolean = false;
  contactUsFormGroup: FormGroup;
  contactUsModelKey: boolean = false;
  contactEmailId = '';
  forgotPasswordOptionsArray: any[] = [
    {
      'value': 'SQ',
      'label': 'NCPLabel.forgetPasswordSecurityQuestion'
    },
    {
      'value': 'OTP',
      'label': 'NCPLabel.forgetPasswordOTP'
    }
  ];

  acceptPassword;
  changeSub: any;
  validateLoginResponse;
  isExternalUser: boolean;
  pathname: string;
  validationFor: string;
  sigResponseReceived: boolean = false;
  isPasswordIcon: boolean = false;
  mousedown: boolean = false;
  thirdPartySiginError: any;
  constructor(userService: UserService, builder: FormBuilder,
    router: Router, loginFormModel: LoginFormModel, loginValidator: LoginValidator,
    config: ConfigService, public _logger: Logger,
    _utils: UtilsService, public translate: TranslateService, public localStorage: LocalStorageService,
    public eventHandlerService: EventService, public changeRef: ChangeDetectorRef) {
    this.utils = _utils;
    this._userService = userService;
    this._router = router;
    this.loginValidator = loginValidator;

    this.createNewUserFormGroup = loginFormModel.getnNewUserCreationModel();
    this.loginForm = loginFormModel.getLoginFormModel();
    this.enterOTPFormGroup = loginFormModel.getenterOTPFormGroupModel();
    this.loginForm = loginValidator.setLoginValidator(this.loginForm);
    this.passwordRecoveryForm = loginFormModel.getPasswordRecoveryFormModel();
    this.passwordRecoveryForm = loginValidator.setPasswordRecoveryValidator(this.passwordRecoveryForm);
    this.enterOTPFormGroup = loginValidator.setEnterOTPValidator(this.enterOTPFormGroup);
    this.resetPasswordForm = loginFormModel.getResetPasswordFormModel();
    this.resetPasswordForm = loginValidator.setResetPasswordValidator(this.resetPasswordForm);
    this.forgotPasswordOptionsFormGroup = loginFormModel.getForgotPasswordOptionsModel();
    this.createNewUserFormGroup = loginValidator.setnewpasswordValidator(this.createNewUserFormGroup);
    this.configure = config;
    this.contactUsFormGroup = new FormGroup({
      territoryCode: new FormControl(),
      territoryCodeDesc: new FormControl(),
      name: new FormControl(),
      fromAddress: new FormControl(),
      toAddress: new FormControl(),
      contactNumber: new FormControl(),
      subject: new FormControl(),
      emailMessage: new FormControl(),
      serviceName: new FormControl()
    }); 
    this.configure.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        if (!this.configure.getCustom('branding')) {
          this.brandingResponse();
        }
      }
    });
    this.brandingResponse();
  }


  brandingResponse() {
    this.configure.loggerSub.subscribe(data => {
      if (data === 'configLoaded') {
        let brandJsonResponse = this.configure.getJSON({ key: 'META', path: 'branding' });
        brandJsonResponse.subscribe(
          (brandUrl) => {
            if (brandUrl.error !== null
              && brandUrl.error !== undefined
              && brandUrl.error.length >= 1) {
              this._logger.error('ncpJsonCall()===>' + brandUrl.error);
            } else {
              this.brandingJson = brandUrl['login'];
			  this.contactEmailId = brandUrl['footerContact']['mailLink'] ? brandUrl['footerContact']['mailLink'] : 'info@nttdata.com';
              this.configure.setCustom('branding', brandUrl);
              this.configure.loggerSub.next('brandingLoaded');
              this.changeRef.markForCheck();
            }
          });
      }
    });

  }

  ngOnInit() {
    let lang: any = this.localStorage.get('User_lang');
    if (lang) {
      this.translate.use(lang);
    }

    //  for(let i = 1 ; i <= 20 ; i++){
    //       this.questions.push({"key": ('Q' + i),"value":this.utils.getTranslated('Q' + i)},);
    //  }
    // let v = this.utils.getTranslated('Q1');
    // console.log(v);
    this.questions.push({ 'key': 'Q01', 'value': 'What was your childhood nickname?' });
    this.questions.push({ 'key': 'Q02', 'value': 'What is the name of the primary school that you attended?' });
    this.questions.push({ 'key': 'Q03', 'value': 'What is the name of your favorite pet?' });
    this.questions.push({ 'key': 'Q04', 'value': 'In what city were you born?' });
    this.questions.push({ 'key': 'Q05', 'value': 'What is your mother\'s maiden name?' });
    this.questions.push({ 'key': 'Q06', 'value': 'What is your favorite movie?' });
    this.questions.push({ 'key': 'Q07', 'value': 'What is the last name of your favorite childhood friend?' });
    this.questions.push({ 'key': 'Q08', 'value': 'What is the name of the place your wedding reception was held?' });
    this.questions.push({ 'key': 'Q09', 'value': 'What is your father\'s middle name?' });
    this.questions.push({ 'key': 'Q10', 'value': 'What was the make of your first car?' });
    this.questions.push({ 'key': 'Q11', 'value': 'What is your oldest sibling\'s birthday month and year? (e.g., January 1900)' });
    this.questions.push({ 'key': 'Q12', 'value': 'Which town was your maternal grandmother was born in?' });
    this.questions.push({ 'key': 'Q13', 'value': 'In what city or town was your first job?' });
    this.questions.push({ 'key': 'Q14', 'value': 'What is the name of your first grade teacher?' });
    this.questions.push({ 'key': 'Q15', 'value': 'What time of the day were you born? (hh:mm)' });
    this.questions.push({ 'key': 'Q16', 'value': 'What is the name of the first school that you attended?' });
    this.questions.push({ 'key': 'Q17', 'value': 'Which is your all-time favorite movie?' });
    this.questions.push({ 'key': 'Q18', 'value': 'When you were young, what did you want to be when you grew up?' });
    this.questions.push({ 'key': 'Q19', 'value': 'Who was your childhood hero?' });
    this.questions.push({ 'key': 'Q20', 'value': 'What is your best friend\'s father\'s first name?' });
    if (this.loginForm.value.user_id == null || this.loginForm.value.user_id === '' || this.loginForm.value.user_id === undefined) {
      this.forgotPass = true;
    }

    this._userService.firstLoginSub.subscribe((data) => {
      if (data.firstLogin) {
        this.createNewUserModal = true;
        this.createNewUserFormGroup.get('user_id').patchValue(data.user_id);
      }
    });

    this._userService.errorLoginPage.subscribe((data) => {
      this.loginForm.reset();
      this.isError = true;
      this.errors = data;
    });
    this.changeSub = this.eventHandlerService.changeSub.subscribe((data) => {
      if (data.id === 'forgotPasswordOptionSelected') {
        if (data.value === 'SQ') this.fetchRecoveryQuestions();
        else if (data.value === 'OTP') this.sendOTP();
      }
    });

    this._userService.forceLoginSub.subscribe(data => {
      if (data) {
        if (data.token) {
          this.logoutToken = data;
        }
        this.isForceLogin = true;
      }
    });

  }
  /**
  * Authenticate Users .
  * It calls validateLogin for NCP users and getUserDetails for SSO through onSubmit method inside UserService class
  * @param {Object} credentials - Login Details entered by user
  * @return {void}
  */
  public onSubmit(credentials) {
    if (!credentials['isForceLogin']) {
      // credentials = this.utils.hashUserSensitiveInfo(credentials);
      credentials = credentials;
    }
    this._userService.onSubmit(credentials);
    // + 2FA Integration 
    this._userService.requestSigSub.subscribe(data => {
      this.validateLoginResponse = data.dataVal;
      this.isExternalUser = data.isExternalUser;
      this.pathname = data.pathname;
      this.validationFor = 'login';
      this.addSecondaryAuthIFrame();
      // this.sigResponseReceived = true;
      Duo.init({
        'host': 'api-6c49286e.duosecurity.com',
        'sig_request': data.sig_request,
        'submit_callback': this.sendSigResponseForVerification,
        'implicitObject': this
      });
    });
    // - 2FA Integration
    let lang = this.localStorage.get('User_lang');
    if (lang == undefined || lang == null) {
      this.localStorage.set('User_lang', 'en');
      this.localStorage.set('User_lang_Desc', 'English');
    }
  }

  sendSigResponseForVerification() {
    let sig_response = (<HTMLInputElement>document.getElementById('duo_input_sig_response')).value;
    let inputJson = {
      'user_id': this.loginForm.value.user_id,
      'sig_response': sig_response,
      'action': this.validationFor
    };
    let isValidUser = this._userService.verifySecondaryLogin(inputJson);
    isValidUser.subscribe((userlogin) => {
      if (userlogin.error && userlogin.error.length >= 1) {
        this.isError = true;
        this.errors = [];
        this.errors = userlogin.error;
        this.removeSecondaryAuthIFrame();
        this._userService.errorLoginPage.next(this.errors);
        this.configure._router['/login'];
        this.configure.setLoadingSub('no');
      } else {
        this.isError = false;
        this.removeSecondaryAuthIFrame();
        if (this.validationFor == 'forgotPassword') {
          this.resretPassword = true;
          this.resetPasswordForm.reset();
          this.passwordRecoveryForm.controls['passwordRecoveryString'].patchValue(userlogin['passwordRecoveryString']);
        } else {
          if (userlogin['token']) {
            this.configure.setCustom('token', userlogin['token']);
            this.configure.reGenerateToken();
          }
          this._userService.doSuccessHandler(this.validateLoginResponse, this.isExternalUser, this.pathname);
        }
      }
    });
  }
  addSecondaryAuthIFrame() {
    let duo_iframe = document.getElementById('duo_iframe');
    if (duo_iframe === undefined || duo_iframe === null) {
      let iframe = document.createElement('iframe');
      iframe.id = 'duo_iframe';
      document.getElementsByTagName('body')[0].appendChild(iframe);
    } else {
      duo_iframe.style.display = 'block';
    }
    document.getElementById('overlay').style.height = '100%';
  }
  removeSecondaryAuthIFrame() {
    // this.sigResponseReceived = false;
    document.getElementById('overlay').style.height = '0%';
    let duo_iframe = document.getElementById('duo_iframe');
    // duo_iframe.parentNode.removeChild(duo_iframe);
    duo_iframe['style']['display'] = 'none';
    this.configure.setLoadingSub('no');
  }
  // + Authenticate the OTP Entered By User
  doAuthenticateOTP() {
    if (this.enterOTPFormGroup.value.user_OTP !== '' && this.enterOTPFormGroup.value.user_OTP !== null)
      if (parseInt(this.enterOTPFormGroup.value.user_OTP) === this.latestOTP) {
        this.enterOTP = false;
        this.resretPassword = true;
        this.forgotPasswordOptionsFormGroup.reset();
        this.enterOTPFormGroup.reset();
      }
  }
  // - Authenticate the OTP Entered By User
  // + Fetch Mobile Number attached to the given user_id and send OTP
  public sendOTP() {
    if (this.loginForm.value.user_id !== null && this.loginForm.value.user_id !== '' && this.loginForm.value.user_id !== undefined) {
      this.latestOTP = 0;
      let credentials = [{
        user_id: this.loginForm.value.user_id,
        user_mobile: ''
      }];
      this.validationFor = 'forgotPassword';
      let loginResp = this.configure.ncpRestAuthServiceCall('idmServices/validateUserForgotPassword', credentials, 'false')
      loginResp.subscribe(
        (dataVal) => {
          if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
            this.isError = true;
            this.errors = [];
            for (let i = 1; i < dataVal.error.length; i++) {
              this.errors.push({ 'errCode': dataVal.error[i].errCode, 'errDesc': dataVal.error[i].errDesc });
            }
            this._userService.errorLoginPage.next(this.errors);
          } else {
            if (dataVal && dataVal.sig_request) {
              this.addSecondaryAuthIFrame();
              this.forgotPasswordBySecAuth = true;
              Duo.init({
                'host': 'api-6c49286e.duosecurity.com',
                'sig_request': dataVal.sig_request,
                'submit_callback': this.sendSigResponseForVerification,
                'implicitObject': this
              });
            } else {
              loginResp = this.configure.ncpRestAuthServiceCall('idmServices/getUserMobileNumber', credentials, 'false')
              loginResp.subscribe(
                (dataVal) => {
                  if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
                    this.isError = true;
                    this.errors = [];
                    for (let i = 1; i < dataVal.error.length; i++) {
                      this.errors.push({ 'errCode': dataVal.error[i].errCode, 'errDesc': dataVal.error[i].errDesc });
                    }
                    this._userService.errorLoginPage.next(this.errors);
                    this.configure.setLoadingSub('no');
                  } else {
                    if (dataVal.user_mobile !== undefined && dataVal.user_mobile !== '') {
                      this.latestOTP = Math.floor(100000 + Math.random() * 900000);
                      let msg = 'Your Onetime password is ' + this.latestOTP;
                      let apiUrl = 'https://instantalerts.co/api/web/send/?apikey=69iq54a4m4s4ib0agg135o3y0yfbkbmbu&sender=SEDEMO&to=' + dataVal.user_mobile + '&message=Test+message=' + msg;
                      let OTPSentResponse = this.configure.ncpJsonCall(apiUrl);
                      OTPSentResponse.subscribe(
                        (resp) => {
                          if (resp.status !== 'AWAITED-DLR') {
                            this._logger.error(resp.message);
                          } else {
                            this.masked_user_mobile = '' + dataVal.user_mobile + '';
                            this.masked_user_mobile = this.masked_user_mobile.slice(-4);
                            this.masked_user_mobile = 'XXXXXX' + this.masked_user_mobile;
                            this.enterOTP = true;
                            this.forgotPasswordByOTP = true;
                            this.configure.setLoadingSub('no');
                          }
                        });
                    }
                  }
                },
                (error) => {
                  this.doErrorHandler(error);
                  this._userService.errorLoginPage.next(this.errors);
                }
              );
            }

          }
          this.configure.setLoadingSub('no');
          this.forgetPasswordOptions = false;
          this.changeRef.detectChanges();
        },
        (error) => {
          this.doErrorHandler(error);
          this._userService.errorLoginPage.next(this.errors);
        }
      );
    }
  }

  // - Fetch Mobile Number attached to the given user_id and send OTP
  fetchRecoveryQuestions() {
    let input = [];
    input[0] = this.loginForm.value;
    let errorVOList = [{ errCode: '', errDesc: '' }];
    let resp;
    input[0].errorVOList = errorVOList;
    Object.assign(input[0], this.passwordRecoveryForm.value);
    delete input[0]['recoveryAnswer1'];
    delete input[0]['recoveryAnswer2'];
    resp = this.configure.ncpRestServiceCall('idmServices/fetchPasswordRecoveryQuestions', input);
    resp.subscribe(
      (data: any) => {
        if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
          this.configure.setLoadingSub('no');
          this.isError = true;
          this.errors = [];
          for (let i = 0; i < data.error.length; i++) {
            if (data.error[i].errCode)
              this.errors.push({ 'errCode': data.error[i].errCode, 'errDesc': data.error[i].errDesc });
          }
        } else {
          this.isError = false;
          this.forgotPasswordByRecoveryQuestions = true;
          this.configure.setLoadingSub('no');
          this.forgotPassword = true;
          this.passwordRecoveryForm.patchValue(data);
          this.questions.forEach(question => {
            if (question.key === data.recoveryQuestion1_code) {
              this.passwordRecoveryForm.get('recoveryQuestion1_code').patchValue(question.value);
            }
            if (question.key === data.recoveryQuestion2_code) {
              this.passwordRecoveryForm.get('recoveryQuestion2_code').patchValue(question.value);
            }
          });
          this.passwordRecoveryForm.updateValueAndValidity();
          this.forgetPasswordOptions = false;
          this.changeRef.detectChanges();
        }
      },
      (error) => {
        this.doErrorHandler(error);
      }
    );
  }

  validateAnswers() {
    let input = [];
    //let hashedUserJSON = this.utils.hashUserSensitiveInfo(this.passwordRecoveryForm.value);
    input[0] = this.loginForm.value;
    let errorVOList = [{ errCode: '', errDesc: '' }];
    let resp;
    input[0].errorVOList = errorVOList;
    let inputJSON = [{ 'user_id': input[0].user_id, 'salt': '', 'oneTimeSalt': '', 'recovery_answers_salt': '' }];
    let oneTimeSalt = this.configure.ncpRestServiceCall('idmServices/getOneTimeSalt', inputJSON);
    oneTimeSalt.subscribe(
      (oneTimeSaltResponse: any) => {
        if (!oneTimeSaltResponse.recovery_answers_salt) {
          oneTimeSaltResponse.recovery_answers_salt = '';
        }
        Object.assign(input[0], this.passwordRecoveryForm.value);
        let hashedRecoveryAnswer1 = this.utils.doHashValue(oneTimeSaltResponse.recovery_answers_salt + input[0].recoveryAnswer1);
        hashedRecoveryAnswer1 = this.utils.doHashValue(oneTimeSaltResponse.oneTimeSalt + hashedRecoveryAnswer1);
        let hashedRecoveryAnswer2 = this.utils.doHashValue(oneTimeSaltResponse.recovery_answers_salt + input[0].recoveryAnswer2);
        hashedRecoveryAnswer2 = this.utils.doHashValue(oneTimeSaltResponse.oneTimeSalt + hashedRecoveryAnswer2);
        input[0].recoveryAnswer1 = hashedRecoveryAnswer1;
        input[0].recoveryAnswer2 = hashedRecoveryAnswer2;
        resp = this.configure.ncpRestServiceCall('idmServices/validatePasswordRecovery', input);
        resp.subscribe(
          (data: any) => {
            if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
              this.configure.setLoadingSub('no');
              this.isModalError = true;
              this.modalErrors = [];
              for (let i = 1; i < data.error.length; i++) {
                this.modalErrors.push({ 'errCode': data.error[i].errCode, 'errDesc': data.error[i].errDesc });
              }
            } else {
              this.isModalError = false;
              this.configure.setLoadingSub('no');
              this.forgotPassword = false;
              this.resretPassword = true;
              this.passwordRecoveryForm.patchValue(data);
            }
          },
          (error) => {
            this.doErrorHandler(error);
          }
        );
      }
    );
  }
  doErrorHandler(error) {
    this.configure.setLoadingSub('no');
    this.isError = true;
    this.errors = [];
    this.errors.push({ 'errDesc': 'Server Error' });
    this._logger.error('URL Error:===>' + error);
  }
  changePassword(passwordFormValue?) {
    let input = [];
    input[0] = this.loginForm.value;
    let errorVOList = [{ errCode: '', errDesc: '' }];
    let resp;
    input[0].errorVOList = errorVOList;
    Object.assign(input[0], this.resetPasswordForm.value, this.passwordRecoveryForm.value);
    let responseArray: any[] = this.utils.checkUserPassword(input[0]);
    if (responseArray.length > 1) {
      this.configure.setLoadingSub('no');
      this.isModalError = true;
      this.modalErrors = [];
      for (let i = 1; i < responseArray.length; i++) {
        this.modalErrors.push({ 'errCode': responseArray[i].errCode, 'errDesc': responseArray[i].errDesc });
      }
    } else {
      // input[0] = this.utils.hashUserSensitiveInfo(input[0]);
      let inputJSON = [{ 'user_id': input[0].user_id, 'salt': '', 'oneTimeSalt': '' }];
      let oneTimeSalt = this.configure.ncpRestServiceCall('idmServices/getOneTimeSalt', inputJSON);
      oneTimeSalt.subscribe(
        (oneTimeSaltResp: any) => {
          if (oneTimeSaltResp.oneTimeSalt) {
            let hashedUserPassword = this.utils.doHashValue(oneTimeSaltResp.oneTimeSalt + input[0].user_password);
            input[0].user_password = hashedUserPassword;
            input[0].confirm_password = hashedUserPassword;
            resp = (this.forgotPasswordByRecoveryQuestions || this.forgotPasswordBySecAuth) ? this.configure.ncpRestServiceCall('idmServices/validateRecoveryLink', input) : this.configure.ncpRestServiceCall('idmServices/updatePasswordBasedOnOTP', input);
            resp.subscribe(
              (data: any) => {
                if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                  this.configure.setLoadingSub('no');
                  this.isModalError = true;
                  this.modalErrors = [];
                  for (let i = 1; i < data.error.length; i++) {
                    this.modalErrors.push({ 'errCode': data.error[i].errCode, 'errDesc': data.error[i].errDesc });
                  }
                } else {
                  this.isModalError = false;
                  this.configure.setLoadingSub('no');
                  this.resretPassword = false;
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

  passwordMismatch() {
    if (this.resetPasswordForm.value.user_password !== this.resetPasswordForm.value.confirm_password) {
      this.passwordMatch = false;
    } else {
      this.passwordMatch = true;
    }
  }

  forgotpassCheck() {
    if (this.loginForm.value.user_id == null || this.loginForm.value.user_id === '' || this.loginForm.value.user_id === undefined) {
      this.forgotPass = false;
    } else {
      this.forgotPass = true;
    }
  }

  /*firstLoginUser() {
    let userupdateArray: any[] = [];
    let responseArray: any[] = this.utils.checkUserPassword(this.createNewUserFormGroup.value);
    if (responseArray.length > 1) {
      this.isError = true;
      this.errors = [];
      for (let i = 0; i < responseArray.length; i++) {
        this.errors.push({ 'errCode': responseArray[i].errCode, 'errDesc': responseArray[i].errDesc });
      }
      this.configure.setLoadingSub('no');
    } else {
      let hashedUserJSON = this.utils.hashUserSensitiveInfo(this.createNewUserFormGroup.value);
      userupdateArray.push(hashedUserJSON);
      let userloginResponse = this._userService.updateUserPasswordDetails(userupdateArray);
      userloginResponse.subscribe(
        (userlogin) => {
          if (userlogin.error !== null && userlogin.error !== undefined && userlogin.error.length >= 1) {
            this.isError = true;
            this.errors = [];
            for (let i = 0; i < userlogin.error.length; i++) {
              if (userlogin.error[i].errCode)
                this.errors.push({ 'errCode': userlogin.error[i].errCode, 'errDesc': userlogin.error[i].errDesc });
              this.configure.setLoadingSub('no');

            }
          } else {
            this.isError = false;
            this.createNewUserModal = false;
            this.configure.setLoadingSub('no');

          }

        });
    }

  }*/



  gotToTermsAndConditions() {
    this._userService.setLoggedIn();
    this.configure.navigateRouterLink('ncp/termsandConditions');

  }
  ngAfterContentInit() {
    let brandingData = this.configure.getCustom('branding');
    if (this.configure.getCustom('thirdPartySiginError') && this.configure.getCustom('thirdPartySiginError') !== ''){
        this.thirdPartySiginError = this.configure.getCustom('thirdPartySiginError');
        this.configure.setCustom('thirdPartySiginError', '');
        this.configure.loggerSub.next('configLoaded');
    }
    if (brandingData) {
      this.brandingJson = brandingData['login'];
      this.changeRef.markForCheck();
    }

    this.loginForm.get('user_password').valueChanges.subscribe(data => {
      this.isError = false;
    });

    this.loginForm.get('user_id').valueChanges.subscribe(data => {
      this.isError = false;
    });

    this.createNewUserFormGroup.get('user_password').valueChanges.subscribe(data => {
      if (this.loginValidator.passwordMismatch(data, this.createNewUserFormGroup.get('confirm_password').value)) {
        this.createNewUserFormGroup.get('confirm_password').setErrors({ 'mismatch': true, 'pattern': true });
      }
    });
    this.createNewUserFormGroup.get('confirm_password').valueChanges.subscribe(data => {
      if (this.loginValidator.passwordMismatch(data, this.createNewUserFormGroup.get('user_password').value)) {
        this.createNewUserFormGroup.get('confirm_password').setErrors({ 'mismatch': true, 'pattern': true });
      }
    });
    this.enterOTPFormGroup.get('user_OTP').valueChanges.subscribe(data => {
      if (parseInt(this.enterOTPFormGroup.get('user_OTP').value) !== this.latestOTP) {
        this.enterOTPFormGroup.get('user_OTP').setErrors({ 'mismatch': true, 'pattern': true });
      }
    });
  }
  forgotPasswordFormGroupClear() {
    this.forgotPassword = false;
    this.forgotPasswordOptionsFormGroup.reset();
  }
  doclose() {
    this.enterOTP = false;
    this.enterOTPFormGroup.reset();
    this.forgotPasswordOptionsFormGroup.reset();
  }
  forgetPasswordOptionsModal() {
    if (this.loginForm.value.user_id == null || this.loginForm.value.user_id === '' || this.loginForm.value.user_id === undefined) {
      this.blurFlag = true;
    } else {
      this.blurFlag = false;
      this.forgetPasswordOptions = true;
      this.forgotPasswordOptionsFormGroup.reset();
      this.passwordRecoveryForm.reset();
      this.modalErrors = [];
      this.isModalError = false;
      this.resetPasswordForm.reset();
      this.acceptPassword = '';
    }
  }
  passwordStrength(event: any) {
    let value;
    value = event instanceof Object ? event.target.value : event;
    this.acceptPassword = value;
  }

  doForceLogin() {
    let formValue = this.loginForm.value;
    formValue['isForceLogin'] = true;
    this.isForceLogin = false;
    this._userService.forceLogout(this.logoutToken, formValue);

  }

  openContactUs() {
    this.contactUsFormGroup.reset();
    this.contactUsModelKey = false;
    this.contactUsFormGroup.get('fromAddress').setValidators(Validators.compose([EmailIdvalidators.mailFormat]));
    this.contactUsFormGroup.get('fromAddress').updateValueAndValidity();
    this.contactUsFormGroup.get('name').setValidators(Validators.compose([Validators.required]));
    this.contactUsFormGroup.get('name').updateValueAndValidity();
    this.contactUsFormGroup.get('contactNumber').setValidators(Validators.compose([Validators.required]));
    this.contactUsFormGroup.get('contactNumber').updateValueAndValidity();
    this.contactUsFormGroup.get('subject').setValidators(Validators.compose([Validators.required]));
    this.contactUsFormGroup.get('subject').updateValueAndValidity();
    this.contactUsFormGroup.get('emailMessage').setValidators(Validators.compose([Validators.required]));
    this.contactUsFormGroup.get('emailMessage').updateValueAndValidity();
    this.contactUsFormGroup.get('toAddress').patchValue(this.contactEmailId);
    this.contactUsFormGroup.get('serviceName').patchValue('SEND_EMAIL');
    this.contactUsModelKey = true;
  }
  
  closeContactUs() {
    this.contactUsModelKey = false;
  }

  contactUsSubmit() {
    let emailMessage = "Name: " + this.contactUsFormGroup.get('name').value + "<br/>E-Mail: " + this.contactUsFormGroup.get('fromAddress').value + "<br/>Contact Number: " + this.contactUsFormGroup.get('contactNumber').value + "<br/><br/> Message: <br/><i>" + this.contactUsFormGroup.get('emailMessage').value + "</i>";
    this.contactUsFormGroup.get('emailMessage').patchValue(emailMessage);
    let inputJSON = [this.contactUsFormGroup.value];
    console.log(this.contactUsFormGroup.value);
    let response = this.utils.triggerNIPService(inputJSON);
    response.subscribe((triggereNIPResponse) => {
      if (triggereNIPResponse.error && triggereNIPResponse.error.length >= 1) {
        this.configure.setLoadingSub('no');
      } else {
        this.contactUsModelKey = false;
        this.configure.setLoadingSub('no');
      }
    });
  }

  redirectThirdPartySignin(tpSigninType) {
    let payload = {
      'tpSigninType' : tpSigninType
    };
    let urlDetailResponse = this.configure.ncpRestServiceCall('idmServices/getTPSigninUrl',  payload);
    urlDetailResponse.subscribe(
      (urlResponse) => {
        if (urlResponse.error !== null && urlResponse.error !== undefined && urlResponse.error.length >= 1) {
          this.isError = true;
          this.errors = [];
          for (let i = 1; i < urlResponse.error.length; i++) {
            this.errors.push({ 'errCode': urlResponse.error[i].errCode, 'errDesc': urlResponse.error[i].errDesc });
          }
        } else {
          if (urlResponse.signinUrl !== null && urlResponse.signinUrl !== undefined && urlResponse.tpSigninHttpMethod === 'GET') {
            localStorage.setItem('tpLogoutUrl', urlResponse['logoutUrl']);
            document.location.href = urlResponse['signinUrl'];
          } else {
            this.thirdPartySiginError = {};
            this.thirdPartySiginError.errorType = 'thirdPartySiginError';
            this.thirdPartySiginError.errCode = 204;
            this.thirdPartySiginError.errDesc = 'NCPLabel.thirdPartySigninErrorForGeneratingUrl';
            this._logger.error('NCPLabel.thirdPartySigninErrorForGeneratingUrl');
          }
        }
      },
      (error) => {
        this.thirdPartySiginError = {};
        this.thirdPartySiginError.errorType = 'thirdPartySiginError';
        this.thirdPartySiginError.errCode = 500;
        this.thirdPartySiginError.errDesc = 'NCPLabel.thirdPartySigninErrorForGeneratingUrl';
        this._logger.error('NCPLabel.thirdPartySigninErrorForGeneratingUrl');
      }
    );
  }
}

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalModule, AllUiComponents, SharedModule],
  exports: [LoginComponent],
  providers: [UserService, LoginFormModel, LoginValidator, Logger, AuthGuard]
})

export class LoginModule { }
