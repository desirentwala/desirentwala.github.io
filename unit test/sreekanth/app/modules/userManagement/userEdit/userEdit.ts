import { AfterContentInit, OnInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker/services/ncp-date-picker.date.format.service';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { UserFormService } from '../services/userform.service';
@Component({
    selector: 'user-edit',
    templateUrl: 'userEdit.html'
})

export class UserEditComponent implements OnInit,AfterContentInit {
    public userMaintenanceFormGroup: FormGroup;
    userpartyFormgroup: FormGroup;
    loaderConfig;
    updateUserModal = false;
    dateFormatService;
    isError = false;
    errors = [];
    //technicalUserList = [];
    newdate;
    inputType = 'E';
    currencyCode;
    userGroupPermission: FormArray;

    constructor(public formBuilder: FormBuilder,
        public _logger: Logger,
        public userService: UserFormService,
        loaderConfigService: ConfigService,
        public ConfigService: ConfigService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public utilsService: UtilsService) {
        this.dateFormatService = new DateFormatService(this.ConfigService);
        this.loaderConfig = loaderConfigService;
       // this.userMaintenanceFormGroup = this.userService.getuserformModel();
       this.userMaintenanceFormGroup = this.userService.getuserformModel();

        this.userpartyFormgroup = this.userService.getPartyidmodel();
        let partyid = this.userMaintenanceFormGroup.get('user_party_id').value;
        let channelTypeCode = this.userMaintenanceFormGroup.get('channel_type_code').value;
        this.userpartyFormgroup.get('user_party_id').patchValue(partyid);
        this.userpartyFormgroup.get('channel_type_code').patchValue(channelTypeCode);
        /* let technicalUserResponse = this.userService.getTechnicaluserList(this.userService.getTechnicaluserModel());
        technicalUserResponse.subscribe(
            (technicalUser) => {
                if (technicalUser.error) {
                    this.loaderConfig.setLoadingSub('no');
                    this._logger.error('error() ===>', 'error in technical user' + technicalUser.error);
                } else {
                    this.loaderConfig.setLoadingSub('no');
                    let response = this.utilsService.convertArrayDataListToDropdownList(technicalUser, 'user_email', 'user_id');
                    this.technicalUserList = response;
                }
            }
        ); */
    }

    ngOnInit(){
        this.userMaintenanceFormGroup.reset();
        let dataObj = this.loaderConfig.getCustom('userDetails');
        const arr = <FormArray>this.userMaintenanceFormGroup.controls['userGroupPermission']
        arr.controls = [];
        this.userMaintenanceFormGroup.controls['userGroupPermission'].updateValueAndValidity()
        if(dataObj.userGroupPermission){
            for (let i = 0; i < dataObj.userGroupPermission.length; i++) {
                this.addPermission();
            }
        }
        this.loaderConfig.setCustom('ugPermission', dataObj.user_group_code);
        this.userMaintenanceFormGroup.patchValue(dataObj);
        this.changeRef.markForCheck();
    }

    updateUserDetails() {
        this.userMaintenanceFormGroup.get('user_id').enable();
        let userGroupPermissionDetails = new Array();
        let userGroupPermissions = this.userMaintenanceFormGroup.get('userGroupPermission').value;
        let userGroupIds = this.userMaintenanceFormGroup.get("user_group_code").value;

        let tempJson = {};
        if (userGroupIds) {
            for (let i = 0; i < userGroupIds.length; i++) {
                tempJson['user_group_code'] = userGroupIds[i].code;
                userGroupPermissionDetails.push(tempJson);
                tempJson = {};
            }
        }
        let tempString = '';
        if (userGroupPermissions) {
            for (let i = 0; i < userGroupPermissions.length; i++) {
                userGroupPermissions[i].userGroupPermission.forEach(element => {
                    tempString = element.code + '|' + tempString;
                });
                userGroupPermissionDetails[i]['user_permissions'] = tempString;
                tempString = '';
            }
        }
        this.userMaintenanceFormGroup.get('user_group_details').patchValue(userGroupPermissionDetails);

       // this.userService.setUserFormModel(this.userMaintenanceFormGroup.value);

        //let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.userService.getuserformModel().value);
        let udatedArray: any[] = [];
        udatedArray.push(this.userMaintenanceFormGroup.value);
        let updateUserDetailResponse = this.userService.updateUser(udatedArray);
        updateUserDetailResponse.subscribe(
            (responseData) => {
                if (responseData.error) {
                    this._logger.error('UpdateUser() ===>' + responseData.error);
                } else {
                    if (responseData.status === true) {
                        this.updateUserModal = true;
                    }
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    checkPartyid() {
        let partyIdResponse = this.userService.doCheckpartyid(this.userpartyFormgroup.value);
        partyIdResponse.subscribe(
            (partyIddetails) => {
                if (partyIddetails.error !== null && partyIddetails.error !== undefined && partyIddetails.error.length >= 1) {
                    this.isError = true;
                    this.errors = [];
                    for (let i = 1; i < partyIddetails.error.length; i++) {
                        this.errors.push({ 'errCode': partyIddetails.error[i].errCode, 'errDesc': partyIddetails.error[i].errDesc });
                        this.userMaintenanceFormGroup.get('user_parent').reset();
                        this.userMaintenanceFormGroup.get('user_parent').updateValueAndValidity();
                        this.userMaintenanceFormGroup.get('user_parent_name').reset();
                        this.userMaintenanceFormGroup.get('user_parent_name').updateValueAndValidity();
                        this.changeRef.markForCheck();
                        this.loaderConfig.setLoadingSub('no');
                    }
                }
                if (partyIddetails.error) {
                    this.updateErrorObject(partyIddetails);
                    this.loaderConfig.setLoadingSub('no');
                    this._logger.error('Getpartyid() ===>', 'user does not exist' + partyIddetails.error);
                    this.userService.partyEE.emit('error');
                } else {
                    this.isError = false;
                    this.loaderConfig.setLoadingSub('no');
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
                    this.changeRef.markForCheck();
                }
            }
        );
    }

    newDate() {
        let date = new Date('01/01/9999');
        this.newdate = this.dateFormatService.formatDate(date);
    }

    navigateUserList() {
        this.updateUserModal = false;
        this.ConfigService.navigateRouterLink('ncp/userManagement/userList');

    }

    ngAfterContentInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
        this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'A') {
                this.userMaintenanceFormGroup.get('user_valid_from').patchValue(this.utilsService.getTodayDate());
            }
        });
        this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'A') {
                this.newDate();
                this.userMaintenanceFormGroup.get('user_expiry_date').patchValue(this.newdate);
            }
        });
        this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'S') {
                this.userMaintenanceFormGroup.get('user_valid_from').patchValue(this.utilsService.getTodayDate());
            }
        });
        this.userMaintenanceFormGroup.get('user_status').valueChanges.subscribe(data => {
            if (this.userMaintenanceFormGroup.get('user_status').value == 'S') {
                this.userMaintenanceFormGroup.get('user_expiry_date').patchValue(this.utilsService.getTodayDate());
            }
        });
        this.userMaintenanceFormGroup.get('user_party_id').valueChanges.subscribe(data => {
            this.userpartyFormgroup.controls['user_party_id'].patchValue(data);
            this.userpartyFormgroup.get('user_party_id').updateValueAndValidity();
        });
        this.userMaintenanceFormGroup.get('currency_code').valueChanges.subscribe(data => {
            if (data) {
                this.currencyCode = data;
            }
        });
        this.currencyCode = this.userMaintenanceFormGroup.get('currency_code').value;
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

    addPermission(): void {
        this.userGroupPermission = this.userMaintenanceFormGroup.get('userGroupPermission') as FormArray;
        this.userGroupPermission.push(this.createPermission());
    }

    removePermission(index): void {
        this.userGroupPermission = this.userMaintenanceFormGroup.get('userGroupPermission') as FormArray;
        this.userGroupPermission.removeAt(index);
    }

    createPermission() {
        return this.userService.getUserPermissionsModel();
    }

}


