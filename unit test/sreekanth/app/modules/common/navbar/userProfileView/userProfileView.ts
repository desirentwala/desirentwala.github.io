import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';
import { EventService } from '../../../../core/services/event.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { SharedService } from '../../../../core/shared/shared.service';
import { AllUiComponents } from '../../../../core/ui-components/all.uicomponents.module';
import { UiButtonModule } from '../../../../core/ui-components/button/index';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { UserFormService } from '../../../userManagement/services/userform.service';
import { UserProfileViewModel } from './models/userProfileView.model';
import { UserProfileService } from './services/userProfileView.service';
import { UserProfileValidator } from './userProfileView.validators';
import { BranchFormService } from '../../../branchManagement';
@Component({
  selector: 'ncp-userprofile',
  templateUrl: './userProfileView.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserprofileComponent implements OnInit {
  detailType = 'UD';
  UserProfileViewFormModel;
  userDetailFormGroup: FormGroup;
  personalDetailFormGroup: FormGroup;
  userProfileValidator;
  NCPDatePickerNormalOptions = {
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'mo',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true
  };
  passwordUpdateModal: boolean = false;
  changePasswordModal: boolean = false;
  currentPassword: boolean = false;
  currentPasswordSetRecovery: boolean = false;
  setRecoveryQuesModal: boolean = false;
  userDetailFlag: boolean = true;
  personalDetailFlag: boolean = false;
  inputArray: any[] = [];
  elementRef;
  imageSrc = 'assets/img/icon_profile.png';
  enableUpdateButton: boolean = false;
  enableEditButton: boolean = true;
  modalFormGroup;
  isError = false;
  isSuccess = false;
  errors = [];
  success = [];
  currentPswd;
  recoveryPswd;
  acceptPassword;
  zipcodeFlag: boolean = false;
  externalUserFlag: boolean = true;
  showImg: boolean = true;
  showSaveButton: boolean;
  showDeleteButton: boolean;
  utils: UtilsService;
  branchService : BranchFormService;
  userImg;
  text;
  isPasswordIcon: boolean = false;
  hidePersonalDetailsfalg: boolean = false;
  mousedown: boolean = false;
  recoveryQuestionError: boolean = false;
  @ViewChild("updatePersonalDetailsSuccesModal") updatePersonalDetailsSuccesModal;
  personalDetailsModal = false;

  constructor(public configService: ConfigService,
    public logger: Logger,
    public changeRef: ChangeDetectorRef,
    userFormBuilder: FormBuilder,
    public userFormService: UserFormService,
    public userProfileService: UserProfileService,
    public _element: ElementRef,
    _utils: UtilsService,
    shared: SharedService,
    public eventHandlerService: EventService,
    _branchService: BranchFormService) {
    let userProfileView = new UserProfileViewModel(userFormBuilder);
    this.UserProfileViewFormModel = userProfileView;
    this.userDetailFormGroup = this.UserProfileViewFormModel.getuserDetailsForm();
    this.personalDetailFormGroup = this.UserProfileViewFormModel.getpersonalDetailsForm();
    this.userProfileValidator = new UserProfileValidator();
    this.userProfileValidator.setPersonalFormValidator(this.personalDetailFormGroup);
    this.utils = _utils;
    this.branchService = _branchService;

  }

  ngOnInit() {

    this.modalFormGroup = this.UserProfileViewFormModel.getModalForm();
    this.userProfileValidator.setModalFormGroupValidator(this.modalFormGroup);
    this.inputArray.push(this.UserProfileViewFormModel.getUserdetail().value);
    this.inputArray[0].user_id = this.configService.getCustom('user_id');
    this.hidePersonalDetailsfalg = this.configService.get('hidePersonalDetailsfalg');
    let getUserDetailsResp = this.userFormService.getUserProfileDetails(this.inputArray);
    getUserDetailsResp.subscribe((userDetails) => {
      this.patchUserDetails(userDetails);
    });

    if (this.configService.getCustom('user_branch') == 'HK') {
      this.zipcodeFlag = false;
    } else {
      this.zipcodeFlag = true;
    }
    this.eventHandlerService.changeSub.subscribe((data)=>{
    if(data.id=='recoveryQuestionChanged'){
        this.compareRecoveryQuestions();
      }
    });
    this.externalUserFlag = !this.configService.getCustom('_isExternalUser');
  }

  nullPwdField() {
    this.modalFormGroup.get('current_password').setValue('');
  }
  deletePhoto() {
    let image = this._element.nativeElement.querySelector('.img-responsive');
    this.imageSrc = "assets/img/icon_profile.png";
    this.userDetailFormGroup.get('user_img').setValue(image.currentSrc);
    image.src = "assets/img/icon_profile.png";
    this.savePhoto();
    this.showImg = true;
    this.showDeleteButton = false;
    this.showDeleteButton = false;
  }

  savePhoto() {
    let image = this._element.nativeElement.querySelector('.img-responsive');
    this.userDetailFormGroup.get('user_img').setValue(image.currentSrc);

    let personalDetailsArray = [];
    personalDetailsArray.push(this.UserProfileViewFormModel.getuserDetailsForm().value);

    personalDetailsArray[0].user_id = this.configService.getCustom('user_id');
    personalDetailsArray[0].user_img = this.userDetailFormGroup.controls['user_img'].value;
    personalDetailsArray[0].user_name = this.userDetailFormGroup.controls['user_name'].value;
    personalDetailsArray[0].roleId = this.userDetailFormGroup.controls['roleId'].value;
    personalDetailsArray[0].roleId_desc = this.userDetailFormGroup.controls['roleId_desc'].value;
    personalDetailsArray[0].user_branch = this.userDetailFormGroup.controls['user_branch'].value;
    personalDetailsArray[0].user_lang_code = this.userDetailFormGroup.controls['user_lang_code'].value;
    personalDetailsArray[0].user_lang_desc = this.userDetailFormGroup.controls['user_lang_desc'].value;
    personalDetailsArray[0].user_mobile = this.userDetailFormGroup.controls['user_mobile'].value;

    personalDetailsArray[0] = this.utils.hashUserSensitiveInfo(personalDetailsArray[0]);
    let getUserDetailsResp = this.userFormService.updateMyProfile(personalDetailsArray);
    getUserDetailsResp.subscribe(
      (response) => {
        this.configService.setLoadingSub('no');
      }
    );
    this.showDeleteButton = true;
    this.showSaveButton = false;
  }
  imageUploaded(input) {
    this.showImg = false;
    let reader = new FileReader();
    let image = this._element.nativeElement.querySelector('.img-responsive');
    reader.onload = (e) => {
      let src = reader.result;
      image.src = src;
    };
    reader.readAsDataURL(input.target.files[0]);
    this.showSaveButton = true;
  }

  openUserDetail() {
    this.personalDetailFlag = false;
    this.userDetailFlag = true;
    this.ngOnInit();
  }
  openPersonalDetail() {
    this.personalDetailFlag = true;
    this.userDetailFlag = false;
  }
  checkCurrentPassword(inputJson?) {
    let userPassword = this.modalFormGroup.controls['current_password'].value;
    let passwordArray = { user_id: '', current_password: '', 'salt': '', 'oneTimeSalt': '' };
    passwordArray.user_id = this.configService.getCustom('user_id');
    //passwordArray = this.utils.hashUserSensitiveInfo(passwordArray);
    let passwordDetailArray: any[] = [];
    passwordDetailArray.push(passwordArray);

    let oneTimeSalt = this.userProfileService.getOneTimeSalt(passwordDetailArray);
    oneTimeSalt.subscribe(
      (oneTimeSaltResponse) => {
        if (oneTimeSaltResponse.salt === undefined || oneTimeSaltResponse.salt == null) {
          oneTimeSaltResponse.salt = '';
        }
        let hashedPassword = this.utils.doHashValue(oneTimeSaltResponse.salt + userPassword);
        hashedPassword = this.utils.doHashValue(oneTimeSaltResponse.oneTimeSalt + hashedPassword);
        passwordArray.current_password = hashedPassword;
        let currentPwdResponse = this.userProfileService.validateUserPassword(passwordDetailArray);
        currentPwdResponse.subscribe(
          (currentPwdResponse) => {
            if (currentPwdResponse.status == true) {
              this.currentPassword = false;
              this.changePasswordModal = true;
              this.configService.setLoadingSub('no');
              this.changeRef.markForCheck();
            } else {
              this.isError = true;
              this.errors = [];
              this.errors.push({ 'errDesc': "password is not correct" });
              this.configService.setLoadingSub('no');
              this.changeRef.markForCheck();
            }
          }
        );
      }
    );

    this.currentPswd = this.modalFormGroup.controls['current_password'].value;
    this.modalFormGroup.get('current_password').patchValue('');
    this.modalFormGroup.get('current_password').updateValueAndValidity();
    this.isError = false;
    this.changeRef.markForCheck();

  }

  changePassword() {

    let changePasswordArray: any[] = [];
    changePasswordArray.push(this.UserProfileViewFormModel.getModalForm().value);
    changePasswordArray[0].user_id = this.configService.getCustom('user_id');
    //changePasswordArray[0].current_password = this.modalFormGroup.controls['current_password'].value;
    let user_password = this.modalFormGroup.controls['user_password'].value;
    let confirm_password = this.modalFormGroup.controls['confirm_password'].value;
    let checkUserPasswordInput = { 'user_password': user_password, 'confirm_password': confirm_password, 'current_password': this.currentPswd };
    let responseArray: any[] = this.utils.checkUserPassword(checkUserPasswordInput);
    if (responseArray.length >= 1) {
      this.isError = true;
      this.errors = [];
      for (let i = 0; i < responseArray.length; i++) {
        this.errors.push({ 'errCode': responseArray[i].errCode, 'errDesc': responseArray[i].errDesc });
      }
      this.configService.setLoadingSub('no');
    } else {
      //changePasswordArray[0] = this.utils.hashUserSensitiveInfo(changePasswordArray[0]);
      let oneTimeSaltResponse = this.userProfileService.getOneTimeSalt(changePasswordArray);
      oneTimeSaltResponse.subscribe(
        (oneTimeSaltResp) => {
          if (oneTimeSaltResp.salt === undefined || oneTimeSaltResp.salt == null) {
            oneTimeSaltResp.salt = '';
          }
          let hashCurrentPassword = this.utils.doHashValue(oneTimeSaltResp.salt + this.currentPswd);
          hashCurrentPassword = this.utils.doHashValue(oneTimeSaltResp.oneTimeSalt + hashCurrentPassword);
          changePasswordArray[0].current_password = hashCurrentPassword;
          let hashUserPassword = this.utils.doHashValue(oneTimeSaltResp.oneTimeSalt + user_password);
          changePasswordArray[0].user_password = hashUserPassword;
          let hashConfirmPassword = this.utils.doHashValue(oneTimeSaltResp.oneTimeSalt + confirm_password);
          changePasswordArray[0].confirm_password = hashConfirmPassword;
          let changePwdResponse = this.userProfileService.updateUserProfilePassword(changePasswordArray);
          changePwdResponse.subscribe(
            (changePwdResponse) => {
              if (changePwdResponse.error !== null && changePwdResponse.error !== undefined && changePwdResponse.error.length >= 1) {
                this.isError = true;
                this.errors = [];
                for (let i = 1; i < changePwdResponse.error.length; i++) {
                  this.errors.push({ 'errCode': changePwdResponse.error[i].errCode, 'errDesc': changePwdResponse.error[i].errDesc });
                }
                this.logger.error('changePassword() ===>' + changePwdResponse.error);
                this.configService.setLoadingSub('no');
                this.changeRef.markForCheck();
              } else {
                this.isError = false;
                this.changePasswordModal = false;
                this.passwordUpdateModal = true;
                this.configService.setLoadingSub('no');
                this.changeRef.markForCheck();
              }
            }
          );
        }
      );
    }
  }


  checkCurrentPasswordSetRecovery() {
    let current_password = this.modalFormGroup.controls['current_password'].value;
    let RecoveryArray = { user_id: '', current_password: '', 'salt': '', 'oneTimeSalt': '' };
    RecoveryArray.user_id = this.configService.getCustom('user_id');
    //RecoveryArray = this.utils.hashUserSensitiveInfo(RecoveryArray);
    let recoveryDetailArray: any[] = [];
    recoveryDetailArray.push(RecoveryArray);
    let oneTimeSalt = this.userProfileService.getOneTimeSalt(recoveryDetailArray);
    oneTimeSalt.subscribe(
      (oneTimeSaltResponse) => {
        if (oneTimeSaltResponse.salt === undefined || oneTimeSaltResponse.salt == null) {
          oneTimeSaltResponse.salt = '';
        }
        let hashedPassword = this.utils.doHashValue(oneTimeSaltResponse.salt + current_password);
        hashedPassword = this.utils.doHashValue(oneTimeSaltResponse.oneTimeSalt + hashedPassword);
        RecoveryArray.current_password = hashedPassword;
        let currentPwdResponse = this.userProfileService.validateUserPassword(recoveryDetailArray);
        currentPwdResponse.subscribe(
          (currentPwdResponse) => {
            if (currentPwdResponse.status == true) {
              this.currentPasswordSetRecovery = false;
              let recoveryQuestionsInputJSON = [{ "user_id": this.configService.getCustom('user_id'), "recoveryQuestion1_code": "", "recoveryQuestion2_code": "", "recoveryQuestion1_desc": "", "recoveryQuestion2_desc": "" }];
              let recoveryQuestionsResponse = this.userProfileService.fetchPasswordRecoveryQuestions(recoveryQuestionsInputJSON);
              recoveryQuestionsResponse.subscribe(
                (recoveryQuestionsResponse) => {
                  if (recoveryQuestionsResponse.error !== null && recoveryQuestionsResponse.error !== undefined && recoveryQuestionsResponse.error.length >= 1) {
                    this.isError = true;
                    this.errors = [];
                    for (let i = 0; i < recoveryQuestionsResponse.error.length; i++) {
                      if (recoveryQuestionsResponse.error[i].errCode)
                        this.errors.push({ 'errCode': recoveryQuestionsResponse.error[i].errCode, 'errDesc': recoveryQuestionsResponse.error[i].errDesc });
                    }
                  } else {
                    this.isError = false;
                    this.modalFormGroup.get('recoveryQuestion1_desc').patchValue(recoveryQuestionsResponse.recoveryQuestion1_desc);
                    this.modalFormGroup.get('recoveryQuestion1_desc').updateValueAndValidity();
                    this.modalFormGroup.get('recoveryQuestion2_desc').patchValue(recoveryQuestionsResponse.recoveryQuestion2_desc);
                    this.modalFormGroup.get('recoveryQuestion2_desc').updateValueAndValidity();
                    this.modalFormGroup.get('recoveryQuestion1_code').patchValue(recoveryQuestionsResponse.recoveryQuestion1_code);
                    this.modalFormGroup.get('recoveryQuestion1_code').updateValueAndValidity();
                    this.modalFormGroup.get('recoveryQuestion2_code').patchValue(recoveryQuestionsResponse.recoveryQuestion2_code);
                    this.modalFormGroup.get('recoveryQuestion2_code').updateValueAndValidity();
                  }
                }
              );
              this.setRecoveryQuesModal = true;
              this.modalFormGroup.controls['recoveryAnswer1'].markAsUntouched();
              this.modalFormGroup.controls['recoveryAnswer2'].markAsUntouched();
              this.configService.setLoadingSub('no');
              this.changeRef.markForCheck();
            } else {
              this.isError = true;
              this.errors = [];
              this.errors.push({ 'errDesc': "password is not correct" });
              this.configService.setLoadingSub('no');
              this.changeRef.markForCheck();
            }
          }
        );
      });

    this.recoveryPswd = this.modalFormGroup.controls['current_password'].value;
    this.modalFormGroup.get('current_password').patchValue('');
    this.modalFormGroup.get('current_password').updateValueAndValidity();
    this.isError = false;
    this.changeRef.markForCheck();
  }



  changeRecoveryQuestions() {
    if(this.modalFormGroup.controls['recoveryAnswer1'].value && this.modalFormGroup.controls['recoveryAnswer2'].value){
    let changeRecoveryArray = { user_id: '', current_password: '', recoveryQuestion1_code: '', recoveryQuestion1_desc: '', recoveryAnswer1: '', recoveryQuestion2_code: '', recoveryQuestion2_desc: '', recoveryAnswer2: '', salt: '', oneTimeSalt: '' };
    changeRecoveryArray.user_id = this.configService.getCustom('user_id');
    changeRecoveryArray.recoveryQuestion1_code = this.modalFormGroup.controls['recoveryQuestion1_code'].value;
    changeRecoveryArray.recoveryQuestion2_code = this.modalFormGroup.controls['recoveryQuestion2_code'].value;
    changeRecoveryArray.recoveryQuestion1_desc = this.modalFormGroup.controls['recoveryQuestion1_desc'].value;
    changeRecoveryArray.recoveryQuestion2_desc = this.modalFormGroup.controls['recoveryQuestion2_desc'].value;
    let recoveryAnswer1 = this.modalFormGroup.controls['recoveryAnswer1'].value;
    let recoveryAnswer2 = this.modalFormGroup.controls['recoveryAnswer2'].value;
    // changeRecoveryArray = this.utils.hashUserSensitiveInfo(changeRecoveryArray);
    let updatedArray: any[] = [];
    updatedArray.push(changeRecoveryArray);
    let oneTimeSalt = this.userProfileService.getOneTimeSalt(updatedArray);
    oneTimeSalt.subscribe(
      (oneTimeSaltResponse) => {
        if (oneTimeSaltResponse.salt === undefined || oneTimeSaltResponse.salt == null) {
          oneTimeSaltResponse.salt = '';
        }
        changeRecoveryArray.salt = oneTimeSaltResponse.salt;
        changeRecoveryArray.oneTimeSalt = oneTimeSaltResponse.oneTimeSalt;
        var hashedPassword = this.utils.doHashValue(oneTimeSaltResponse.salt + this.recoveryPswd);
        hashedPassword = this.utils.doHashValue(oneTimeSaltResponse.oneTimeSalt + hashedPassword);
        changeRecoveryArray.current_password = hashedPassword;
        changeRecoveryArray.recoveryAnswer1 = this.utils.doHashValue(oneTimeSaltResponse.oneTimeSalt + recoveryAnswer1);;
        changeRecoveryArray.recoveryAnswer2 = this.utils.doHashValue(oneTimeSaltResponse.oneTimeSalt + recoveryAnswer2);;
        let updateUserDetailResponse = this.userFormService.updatePasswordRecoveryAnswers(updatedArray);
        updateUserDetailResponse.subscribe(
          (responseData) => {
            if (responseData.status === true) {
              this.isSuccess = true;
              this.success = [];
              this.success.push({ 'succDesc': "Updated successfully" });

              this.configService.setLoadingSub('no');
              this.changeRef.markForCheck();
            } else {
              this.isSuccess = false;
              this.configService.setLoadingSub('no');
            }
          }
        );
      }
    );}else{
      if(!this.modalFormGroup.controls['recoveryAnswer1'].value){
          this.modalFormGroup.get('recoveryAnswer1').setErrors({ 'required': true }); 
      }
      if(!this.modalFormGroup.controls['recoveryAnswer2'].value){
          this.modalFormGroup.get('recoveryAnswer2').setErrors({ 'required': true }); 
      }
      this.changeRef.markForCheck();
    }
  }

  resetValidator(){
    this.modalFormGroup.get('recoveryAnswer1').reset();
    this.modalFormGroup.get('recoveryAnswer2').reset();
    this.modalFormGroup.get('recoveryAnswer1').setErrors({ 'required': false }); 
    this.modalFormGroup.get('recoveryAnswer2').setErrors({ 'required': false }); 
    this.configService.setLoadingSub('no');
  }

  UpdatePersonalDetails() {
    let personalDetailsArray: any[] = [];
    personalDetailsArray.push(this.UserProfileViewFormModel.getpersonalDetailsForm().value);
    personalDetailsArray[0].user_id = this.configService.getCustom('user_id');
    personalDetailsArray[0].dob = this.personalDetailFormGroup.controls['dob'].value;
    personalDetailsArray[0].age = this.personalDetailFormGroup.controls['age'].value;
    personalDetailsArray[0].gender = this.personalDetailFormGroup.controls['gender'].value;
    personalDetailsArray[0].addressLine1 = this.personalDetailFormGroup.controls['addressLine1'].value;
    personalDetailsArray[0].addressLine2 = this.personalDetailFormGroup.controls['addressLine2'].value;
    personalDetailsArray[0].zipcode = this.personalDetailFormGroup.controls['zipcode'].value;
    personalDetailsArray[0].city = this.personalDetailFormGroup.controls['city'].value;
    personalDetailsArray[0].user_phone = this.personalDetailFormGroup.controls['user_phone'].value;
    personalDetailsArray[0].user_mobile = this.personalDetailFormGroup.controls['user_mobile'].value;
    let PersonalDetailResponse = this.userFormService.updateMyProfile(personalDetailsArray);
    PersonalDetailResponse.subscribe(
      (PersonalDetailResponse) => {
        if (PersonalDetailResponse.error) {
          this.logger.error('UpdateUserDetails() ===>' + PersonalDetailResponse.error);
        } else {
          if (PersonalDetailResponse.status === true) {
            this.configService.setLoadingSub('no');
            this.personalDetailsModal = true;
            this.changeRef.markForCheck()
            this.updatePersonalDetailsSuccesModal.open()
        } else {
            this.configService.setLoadingSub('no');
          }
        }
      }
    );
  }
  passwordStrength(event: any){
    let value;
    value = event instanceof Object ? event.target.value : event;
    this.acceptPassword=value;
  }
  closePasswordSuccessModal()
  {
   this.passwordUpdateModal=false;
  }
  compareRecoveryQuestions(){
    if (this.modalFormGroup.get('recoveryQuestion1_code').value ===  this.modalFormGroup.get('recoveryQuestion2_code').value){
      this.modalFormGroup.get('recoveryQuestion2_code').setErrors({ 'pattern': true });
      this.changeRef.markForCheck();
    }
    else{
      this.modalFormGroup.get('recoveryQuestion2_code').setErrors({ 'pattern': false });
    }
  }

  patchUserDetails(userDetails) {
    if (userDetails.error) {
      this.logger.error('getUserDetails()===>', userDetails.error);
    } else {
      this.userDetailFormGroup.controls['user_id'].patchValue(userDetails.user_id);
      this.userDetailFormGroup.controls['user_name'].patchValue(userDetails.user_name);
      this.userDetailFormGroup.controls['user_branch'].patchValue(userDetails.user_branch);
      this.userDetailFormGroup.controls['roleId'].patchValue(userDetails.roleId);
      this.userDetailFormGroup.controls['roleId_desc'].patchValue(userDetails.roleId_desc);
      this.userDetailFormGroup.controls['user_lang_code'].patchValue(userDetails.user_lang_code);
      this.userDetailFormGroup.controls['user_lang_desc'].patchValue(userDetails.user_lang_desc);
      this.userDetailFormGroup.controls['user_img'].patchValue(userDetails.user_img);
      this.userImg = this.userDetailFormGroup.get('user_img').value;
      if (this.userImg) {
        this.imageSrc = this.userDetailFormGroup.get('user_img').value;
      }
      if(this.userDetailFormGroup.controls['user_branch'].value){
        let tempJson = { "branch_id": this.userDetailFormGroup.controls['user_branch'].value };
        let branchprofileresponse = this.branchService.getBranchDetails(tempJson);
        branchprofileresponse.subscribe(
            (branchdetail) => {
                if (branchdetail.error) {
                  this.configService.setLoadingSub('no');
                } else {
                  this.userDetailFormGroup.controls['user_branch_desc'].patchValue(branchdetail[0].branch_desc)
                  this.configService.setLoadingSub('no');
                }
            }
        );
      }
      this.personalDetailFormGroup.controls['dob'].patchValue(userDetails.dob);
      this.personalDetailFormGroup.controls['gender'].patchValue(userDetails.gender);
      this.personalDetailFormGroup.controls['addressLine1'].patchValue(userDetails.addressLine1);
      this.personalDetailFormGroup.controls['addressLine2'].patchValue(userDetails.addressLine2);
      this.personalDetailFormGroup.controls['zipcode'].patchValue(userDetails.zipcode);
      this.personalDetailFormGroup.controls['city'].patchValue(userDetails.city);
      this.personalDetailFormGroup.controls['user_phone'].patchValue(userDetails.user_phone);
      this.personalDetailFormGroup.controls['user_mobile'].patchValue(userDetails.user_mobile);
      this.userDetailFormGroup.controls['user_img'].patchValue(userDetails.user_img);
      if (this.imageSrc.length > 100) {
        this.showImg = false;
        this.showDeleteButton = true;
        this.showSaveButton = false;
      }
      else {
        this.showImg = true;
        this.showDeleteButton = false;
      }
      this.userDetailFormGroup.updateValueAndValidity();
      this.configService.setLoadingSub('no');
      this.userDetailFormGroup.disable();
      this.changeRef.markForCheck();
    }
  }
}




@NgModule({
  imports: [CommonModule, AllUiComponents, FormsModule, ReactiveFormsModule, SharedModule, UiButtonModule],
  declarations: [UserprofileComponent],
  exports: [UserprofileComponent],
  providers: [UtilsService, UserFormService, UserProfileService, BranchFormService]
})
export class UserProfileModule { }
