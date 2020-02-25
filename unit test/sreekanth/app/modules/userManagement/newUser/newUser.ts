import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { DateDuration } from '../../../core/ui-components/ncp-date-picker/index';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker/services/ncp-date-picker.date.format.service';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { UserFormService } from '../services/userform.service';
import { UserFormValidator } from '../userform/userform.validator';
@Component({
    selector: 'new-user',
    templateUrl: 'newUser.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewUserComponent implements AfterContentInit, OnInit, OnDestroy {
    public userMaintenanceFormGroup: FormGroup;
    userpartyFormgroup: FormGroup;
    userinfo;
    userFormValidator;
    createUserModal = false;
    isValidCreateUserForm;
    dateFormatService;
    isError = false;
    errors = [];
    dateDuration;
    //technicalUserList = [];
    newdate;
    public subscribedMap = {};
    subscriber;
    constructor(public userInfoForm: FormBuilder,
        public userService: UserFormService,
        public _logger: Logger,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public configService: ConfigService,
        public utilsService: UtilsService,
        _dateduration: DateDuration) {
        this.dateFormatService = new DateFormatService(this.configService);
        this.dateDuration = _dateduration;
        this.userMaintenanceFormGroup = this.userService.getuserformModel();
        this.userFormValidator = new UserFormValidator();
        this.userMaintenanceFormGroup = this.userFormValidator.setUserFormValidator(this.userMaintenanceFormGroup);
        this.userMaintenanceFormGroup.reset();
        this.userMaintenanceFormGroup.get('user_status').patchValue('A');
        let userbranch = this.configService.getCustom('user_branch');
        let user_branch_desc = this.configService.getCustom('user_branch_desc');

        this.userMaintenanceFormGroup.get('user_branch').patchValue(userbranch);
        this.userMaintenanceFormGroup.get('user_branch_desc').patchValue(user_branch_desc);
        /* let technicalUserResponse = this.userService.getTechnicaluserList(this.userService.getTechnicaluserModel());
        technicalUserResponse.subscribe(
            (technicalUser) => {
                if (technicalUser.error) {
                    this.configService.setLoadingSub('no');
                    this._logger.error('error() ===>', 'error in technical user' + technicalUser.error);
                } else {
                    this.configService.setLoadingSub('no');
                    let response = this.utilsService.convertArrayDataListToDropdownList(technicalUser, 'user_email', 'user_id');
                    this.technicalUserList = response;
                }
            }
        ); */
    }

    checkPartyid() {
        this.userpartyFormgroup.patchValue(this.userMaintenanceFormGroup.value);
        let userPartyFormGroupValue = this.userpartyFormgroup.getRawValue();
        if (this.userMaintenanceFormGroup.controls['roleId'].value == 'CST') {
            userPartyFormGroupValue['user_party_id'] = this.userMaintenanceFormGroup.controls['client_party_id'].value;
        }
        let partyIdResponse = this.userService.doCheckpartyid(userPartyFormGroupValue);
        partyIdResponse.subscribe(
            (partyIddetails) => {
                if (partyIddetails.error !== null && partyIddetails.error !== undefined && partyIddetails.error.length >= 1) {

                    if (this.userMaintenanceFormGroup.controls['roleId'].value == 'CST') {
                        this.userMaintenanceFormGroup.get('client_party_id').setErrors({ 'required': true });
                    } else {
                        this.userMaintenanceFormGroup.get('user_party_id').setErrors({ 'required': true });
                    }
                    for (let i = 1; i < partyIddetails.error.length; i++) {
                        this.userMaintenanceFormGroup.get('user_parent').reset();
                        this.userMaintenanceFormGroup.get('user_parent').updateValueAndValidity();
                        this.userMaintenanceFormGroup.get('user_parent_name').reset();
                        this.userMaintenanceFormGroup.get('user_parent_name').updateValueAndValidity();
                        this.changeRef.markForCheck();
                    }
                }
                if (partyIddetails.error) {
                    this.updateErrorObject(partyIddetails);
                    this.configService.setLoadingSub('no');
                    this._logger.error('Getpartyid() ===>', 'user does not exist' + partyIddetails.error);
                    this.userService.partyEE.emit('error');
                } else {
                    if (this.userMaintenanceFormGroup.controls['roleId'].value == 'CST' && partyIddetails.user_party_id) {
                        this.userMaintenanceFormGroup.get('client_party_id').setErrors(null);
                    } 
                    if (this.userMaintenanceFormGroup.controls['roleId'].value != 'CST' && partyIddetails.user_party_id){
                        this.userMaintenanceFormGroup.get('user_party_id').setErrors(null);
                    }

                    this.isError = false;
                    this.userService.partyEE.emit(partyIddetails);
                    this.configService.setLoadingSub('no');
                    this.updatePartyDetails(partyIddetails);
                    this.changeRef.markForCheck();
                }
            }
        );
    }
    CreateNewUser() {
        this.userMaintenanceFormGroup.get('user_id').enable();
        this.isValidCreateUserForm = this.userMaintenanceFormGroup.valid;
        let userdetailArray: any[] = [];
        this.errors = [];
        this.userMaintenanceFormGroup = this.userService.getuserformModel();
        let locationHash: string = window.location.href;
        let locationPathParamsArray = locationHash.substr(0, locationHash.length).split('#');
        let base_url = locationPathParamsArray[0];
        this.userMaintenanceFormGroup.get('page_url').patchValue(base_url + '#/');
        this.userMaintenanceFormGroup.get('page_url').updateValueAndValidity();
        if (this.userMaintenanceFormGroup.controls['roleId'].value !== 'ADM' && this.userMaintenanceFormGroup.controls['roleId'].value !== 'CST') {
            let userGroupIds = this.userMaintenanceFormGroup.get("user_group_code").value;
            let userGroupPermissions = this.userMaintenanceFormGroup.get('userGroupPermission').value;
            let userGroupPermissionDetails = new Array();
            let tempJson = {};
            if (userGroupIds) {
                for (let i = 0; i < userGroupIds.length; i++) {
                    tempJson['user_group_code'] = userGroupIds[i].code;
                    userGroupPermissionDetails.push(tempJson);
                    tempJson = {};
                }
            }
            let tempString = '';
            if (userGroupIds && userGroupPermissions) {
                for (let i = 0; i < userGroupPermissions.length; i++) {
                    userGroupPermissions[i].userGroupPermission.forEach(element => {
                        tempString = element.code + '|' + tempString;
                    });
                    userGroupPermissionDetails[i]['user_permissions'] = tempString;
                    tempString = '';
                }
            }
            this.userMaintenanceFormGroup.get('user_group_details').patchValue(userGroupPermissionDetails);
        }
        if (this.userMaintenanceFormGroup.controls['roleId'].value === 'CST') {
            this.userMaintenanceFormGroup.controls['user_party_id'].patchValue(this.configService.get('b2cPartyId'))
        }

        userdetailArray.push(this.userMaintenanceFormGroup.value);
        if (this.isValidCreateUserForm) {
            let userDetailResponse = this.userService.doCreateUser(userdetailArray);
            userDetailResponse.subscribe(
                (createuserdetail) => {
                    if (createuserdetail.error !== null && createuserdetail.error !== undefined && createuserdetail.error.length >= 1) {
                        this.isError = true;
                        this.errors.push({ 'errCode': createuserdetail.error[1].errCode, 'errDesc': createuserdetail.error[1].errDesc });
                        this._logger.error('doCreateUser() ===>' + createuserdetail.error);
                        window.scrollTo(150, 150);
                        this.changeRef.markForCheck();
                    } else {
                        this._logger.log('user created');
                        let data: any = {};
                        data['user_id'] = this.userMaintenanceFormGroup.get('user_id').value;
                        data['roleId'] = this.userMaintenanceFormGroup.get('roleId').value;
                        if (this.userMaintenanceFormGroup.controls['roleId'].value == 'CST') {
                            data['client_party_id'] = this.userMaintenanceFormGroup.get('client_party_id').value;
                        } else {
                            data['user_party_id'] = this.userMaintenanceFormGroup.get('user_party_id').value;
                        }
                        data['branchCode'] = this.configService.get('user_branch');
                        if (this.userMaintenanceFormGroup.get('user_group_code').value !== 'ADMN') {
                            this.fetchDataAfteruserCreation(data);
                        }
                        this.createUserModal = true;
                        this.configService.setLoadingSub('no');
                        this.changeRef.markForCheck();
                    }
                }
            );
        }
    }
    navigateList() {
        this.configService.navigateRouterLink('ncp/userManagement/userList');
    }
    newDate() {
        let date = new Date('01/01/9999');
        this.newdate = this.dateFormatService.formatDate(date);
    }
    ngOnInit() {
        this.configService.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.configService.currentLangName);
            }
        });

        if (this.userMaintenanceFormGroup.get('user_status').value == 'A') {
            this.userMaintenanceFormGroup.get('user_valid_from').patchValue(this.utilsService.getTodayDate());
        }
        if (this.userMaintenanceFormGroup.get('user_status').value == 'A') {
            this.newDate();
            this.userMaintenanceFormGroup.get('user_expiry_date').patchValue(this.newdate);
        }
        this.userMaintenanceFormGroup.get('confirm_email').disable();
        this.userpartyFormgroup = this.userService.getPartyidmodel();
    }

    ngAfterContentInit() {
        this.subscriber = this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'A') {
                this.userMaintenanceFormGroup.get('user_valid_from').patchValue(this.utilsService.getTodayDate());
            }
        });
        this.subscriber = this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'A') {
                this.newDate();
                this.userMaintenanceFormGroup.get('user_expiry_date').patchValue(this.newdate);
            }
        });

        this.subscriber = this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'S') {
                this.userMaintenanceFormGroup.get('user_valid_from').patchValue(this.utilsService.getTodayDate());
            }
        });
        this.subscriber = this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'S') {
                this.userMaintenanceFormGroup.get('user_expiry_date').patchValue(this.utilsService.getTodayDate());
            }
        });

        this.subscriber = this.userMaintenanceFormGroup.get('user_party_id').valueChanges.subscribe(data => {
            this.userpartyFormgroup.get('user_party_id').patchValue(data);

        });

        this.subscriber = this.userMaintenanceFormGroup.get('user_email').valueChanges.subscribe(data => {
            this.userMaintenanceFormGroup.get('confirm_email').enable();
            if (!this.userMaintenanceFormGroup.get('confirm_email').value)
                this.userMaintenanceFormGroup.get('confirm_email').setValue('');
        });

        this.subscriber = this.subscribedMap['user_expiry_date'] = this.userMaintenanceFormGroup.get('user_expiry_date').valueChanges.subscribe(data => {
            let fromDate = this.userMaintenanceFormGroup.get('user_valid_from').value;
            let toDate = this.userMaintenanceFormGroup.get('user_expiry_date').value;
            let todayDate = this.utilsService.getTodayDate();
            let dateDuration = this.dateDuration.transform(fromDate, toDate);
            if (dateDuration.startDate > dateDuration.endDate) {
                //this.userMaintenanceFormGroup.get('user_expiry_date').setErrors({ 'mismatch': true });
                this.userMaintenanceFormGroup.get('user_expiry_date').patchValue(todayDate);
                this.userMaintenanceFormGroup.get('user_expiry_date').updateValueAndValidity();
            }
        });
    }
    updatePartyDetails(partyIddetails) {
        if (partyIddetails.user_parent) {
            this.userService.setUserFormModel(partyIddetails.user_parent);
            this.userMaintenanceFormGroup.get('user_parent').patchValue(partyIddetails.user_parent);
        }
        if (partyIddetails.user_parent_name) {
            this.userService.setUserFormModel(partyIddetails.user_parent_name);
            this.userMaintenanceFormGroup.get('user_parent_name').patchValue(partyIddetails.user_parent_name);
        }
        if (partyIddetails.firstName) {
            this.userMaintenanceFormGroup.get('firstName').patchValue(partyIddetails.firstName);
        }
        if (partyIddetails.middleName) {
            this.userMaintenanceFormGroup.get('middleName').patchValue(partyIddetails.middleName);
        }
        if (partyIddetails.lastName) {
            this.userMaintenanceFormGroup.get('lastName').patchValue(partyIddetails.lastName);
        }
        if (partyIddetails.fullName) {
            this.userMaintenanceFormGroup.get('fullName').patchValue(partyIddetails.fullName);
        }
    }

    ngOnDestroy() {
        this.subscribedMap['user_expiry_date'].unsubscribe();
        this.subscriber.unsubscribe();
    }

    public updateErrorObject(inputErrorObject) {
        this.isError = true;
        this.errors = [];
        for (let i = 0; i < inputErrorObject.error.length; i++) {
            if (inputErrorObject.error[i].errCode) {
                this.errors.push({ 'errCode': inputErrorObject.error[i].errCode, 'errDesc': inputErrorObject.error[i].errDesc });
            }
        }
        window.scrollTo(150, 150);
        this.changeRef.markForCheck();
    }
    fetchDataAfteruserCreation(data) {
        // let fetchExistingQuotesResponse = this.userService.fetchExistingQuotes(data);
        // fetchExistingQuotesResponse.subscribe();
        let doDataSyncResponse = this.utilsService.doDataSync(data);
        doDataSyncResponse.subscribe();
    }
}
