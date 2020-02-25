import { firstLoginValidator } from './firstlogin.validator';
import { LocalStorageService } from '@adapters/packageAdapter';
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
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnInit, AfterContentInit, Component, NgModule, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'firstlogin-page',
  templateUrl: './firstlogin.template.html'
})
export class FirstLoginComponent implements OnInit, AfterContentInit {
  _userService: UserService;
  utils: UtilsService;
  _router;
  loginValidator;
  createNewUserFormGroup;
  loginForm;
  acceptPassword;
  errors = [];
  isError = false;
  createNewUserModal = true;
  questions = [];

  constructor(userService: UserService, builder: FormBuilder,
    router: Router, loginFormModel: LoginFormModel, loginValidator: firstLoginValidator,
    public configure: ConfigService, public _logger: Logger,
    _utils: UtilsService, public localStorage: LocalStorageService,public changeRef: ChangeDetectorRef) {
    this.utils = _utils;
    this._userService = userService;
    this._router = router;
    this.loginValidator = loginValidator;
    this.createNewUserFormGroup = loginFormModel.getnNewUserCreationModel();
    this.loginForm = loginFormModel.getnNewUserCreationModel();
    this.loginForm = loginValidator.setnewpasswordValidator(this.loginForm);
  }

  ngOnInit() {
    let inputobject = { user_id: this.configure.getCustom("userid"), recoveryString: this.configure.getCustom("recoverystring") };
    let validateLinkResponse = this.configure.ncpRestServiceCall('idmServices/validatePasswordSetLink', inputobject)
    validateLinkResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this.isError = true;
          this.configure.setLoadingSub('no');
          this.changeRef.markForCheck();
          this.errors = [];
          for (let i = 0; i < dataVal.error.length; i++) {
            this.errors.push({ 'errCode': dataVal.error[i].errCode, 'errDesc': dataVal.error[i].errDesc });
          }
         
        } else {
          this.configure.setCustom('token', dataVal.token);
          this.createNewUserFormGroup.get('user_id').patchValue(this.configure.getCustom("userid"));
          this.createNewUserFormGroup.get('user_id').updateValueAndValidity();
          this.createNewUserFormGroup.get('recoveryString').patchValue(this.configure.getCustom("recoverystring"));
          this.createNewUserFormGroup.get('recoveryString').updateValueAndValidity();
          this.configure.setLoadingSub('no');
          this.changeRef.markForCheck();
        }
      });

    this.questions.push({ 'key': "Q01", "value": "What was your childhood nickname?" });
    this.questions.push({ "key": "Q02", "value": "What is the name of the primary school that you attended?" });
    this.questions.push({ "key": "Q03", "value": "What is the name of your favorite pet?" });
    this.questions.push({ "key": "Q04", "value": "In what city were you born?" });
    this.questions.push({ "key": "Q05", "value": "What is your mother's maiden name?" });
    this.questions.push({ "key": "Q06", "value": "What is your favorite movie?" });
    this.questions.push({ "key": "Q07", "value": "What is the last name of your favorite childhood friend?" });
    this.questions.push({ "key": "Q08", "value": "What is the name of the place your wedding reception was held?" });
    this.questions.push({ "key": "Q09", "value": "What is your father's middle name?" });
    this.questions.push({ "key": "Q10", "value": "What was the make of your first car?" });
    this.questions.push({ "key": "Q11", "value": "What is your oldest sibling's birthday month and year? (e.g., January 1900)" });
    this.questions.push({ "key": "Q12", "value": "Which town was your maternal grandmother was born in?" });
    this.questions.push({ "key": "Q13", "value": "In what city or town was your first job?" });
    this.questions.push({ "key": "Q14", "value": "What is the name of your first grade teacher?" });
    this.questions.push({ "key": "Q15", "value": "What time of the day were you born? (hh:mm)" });
    this.questions.push({ "key": "Q16", "value": "What is the name of the first school that you attended?" });
    this.questions.push({ "key": "Q17", "value": "Which is your all-time favorite movie?" });
    this.questions.push({ "key": "Q18", "value": "When you were young, what did you want to be when you grew up?" });
    this.questions.push({ "key": "Q19", "value": "Who was your childhood hero?" });
    this.questions.push({ "key": "Q20", "value": "What is your best friend's father's first name?" });

    this._userService.firstLoginSub.subscribe((data) => {
      if (data.firstLogin) {
        this.createNewUserModal = true;
        this.createNewUserFormGroup.get('user_id').patchValue(data.user_id);
      }
    });

    this._userService.errorLoginPage.subscribe((data) => {
      this.isError = true;
      this.errors = data;
    });
  }

  ngAfterContentInit() {
    this.createNewUserFormGroup.get('user_password').valueChanges.subscribe(data => {
      //  this.createNewUserFormGroup.get('user_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));
      //   this.createNewUserFormGroup.get('confirm_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));
      if (this.loginValidator.passwordMismatch(data, this.createNewUserFormGroup.get('confirm_password').value)) {
        this.createNewUserFormGroup.get('confirm_password').setErrors({ 'mismatch': true, 'pattern': true });
      }


    });
    this.createNewUserFormGroup.get('confirm_password').valueChanges.subscribe(data => {
      if (this.loginValidator.passwordMismatch(data, this.createNewUserFormGroup.get('user_password').value)) {
        this.createNewUserFormGroup.get('confirm_password').setErrors({ 'mismatch': true, 'pattern': true });
      }
    });
  }

  firstLoginUser() {
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
      //let hashedUserJSON = this.utils.hashUserSensitiveInfo(this.createNewUserFormGroup.value);
      userupdateArray.push(this.createNewUserFormGroup.value);
      let inputJSON = [{ 'user_id': userupdateArray[0].user_id, 'salt': '', 'oneTimeSalt': '', 'recovery_answers_salt': '' }];
      let oneTimeSalt = this._userService.getOneTimeSalt(inputJSON);
      oneTimeSalt.subscribe(
        (oneTimeSaltResp) => {
          if (oneTimeSaltResp.salt && oneTimeSaltResp.recovery_answers_salt) {
            let hashedUserPassword = this.utils.doHashValue(oneTimeSaltResp.salt + userupdateArray[0].user_password);
            let hashedRecoverAnswer1 = this.utils.doHashValue(oneTimeSaltResp.recovery_answers_salt + userupdateArray[0].recoveryAnswer1);
            let hashedRecoverAnswer2 = this.utils.doHashValue(oneTimeSaltResp.recovery_answers_salt + userupdateArray[0].recoveryAnswer2);
            userupdateArray[0].user_password = hashedUserPassword;
            userupdateArray[0].confirm_password = hashedUserPassword;
            userupdateArray[0].recoveryAnswer1 = hashedRecoverAnswer1;
            userupdateArray[0].recoveryAnswer2 = hashedRecoverAnswer2;
            userupdateArray[0].salt = oneTimeSaltResp.salt;
            userupdateArray[0].recovery_answers_salt = oneTimeSaltResp.recovery_answers_salt;
            userupdateArray[0].token = this.configure.getCustom('token');
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
                  this.configure.setCustom('firstLoginFlag', false);
                  this.configure.navigateRouterLink('/Login');
                }
              });
          }
        });
    }

  }
  passwordStrength(event: any){
    let value;
    value = event instanceof Object ? event.target.value : event;
    this.acceptPassword=value;
  }

  modalClose()
  {
   this.isError = false;
   this.createNewUserModal = false; 
  }


}

@NgModule({
  declarations: [FirstLoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalModule, AllUiComponents, SharedModule],
  exports: [FirstLoginComponent],
  providers: [UserService, LoginFormModel, LoginValidator, Logger]
})

export class FirstLoginModule { }