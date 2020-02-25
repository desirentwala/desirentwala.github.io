
import { AfterContentInit, AfterViewChecked, Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../../core/services/event.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { PickList } from '../../common/models/picklist.model';
import { UserFormService } from '../services/userform.service';
import { UserFormValidator } from './userform.validator';
import { PickListService } from '../../common';

@Component({
    selector: 'user-form',
    templateUrl: 'userform.component.html'
})

export class UserformComponent implements AfterContentInit, OnDestroy, AfterViewChecked {
    @Input() userMaintenanceFormGroup: FormGroup;
    //@Input() technicalUserList: any = [];
    @Input() inputType = 'N';
    formBuilder: FormBuilder;
    userGroupPermission: FormArray;
    userFormValidator;
    todayDate: Date;
    loaderConfig: ConfigService;
    public todayString: string;
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public doCheck: EventEmitter<any> = new EventEmitter<any>();
    errorFlag: boolean = false;
    eventHndler: EventService;
    userLength: number = 0;
    permissionsArrayCtrl: any = [];
    tempArrayCtrl: any = [];
    userstatus: any[] = [
        { label: 'NCPLabel.Active', value: 'A' },
        { label: 'NCPLabel.suspend', value: 'S' }
    ];
    switchbutton: any = "";
    NCPDatePickerNormalOptions = {
        todayBtnTxt: 'Today',
        firstDayOfWeek: 'mo',
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true
    };
    inputPickList = new PickList();
    mobileinputPickList = new PickList();
    @Input() currencyCode;
    userDetailResponse;
    adsUserList: any[] = [];
    userIDItems: any[] = [];
    ADSuserDetails;
    isChecked = false;
    isadsConfig = false;
    subscriber;
    currentUserBranch: string;

    constructor(public userInfoForm: FormBuilder,
        public userService: UserFormService,
        public utilsService: UtilsService,
        public _logger: Logger,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public _eventHandler: EventService,
        public changeRef: ChangeDetectorRef,
        public picklistService: PickListService) {
        this.eventHndler = _eventHandler;
        this.userMaintenanceFormGroup = this.userService.getuserformModel();
        this.userMaintenanceFormGroup.patchValue(this.userService.getuserformModel().value);
        this.userFormValidator = new UserFormValidator();
        this.userFormValidator.setUserFormValidator(this.userMaintenanceFormGroup);
        this.loaderConfig = loaderConfigService;
        if (this.inputType === 'N') {
            this.userDetailResponse = this.loaderConfig.ncpRestServiceCall('idmServices/getLDAPUserList', '');
            this.userDetailResponse.subscribe(
                (userDetailResponseVal) => {
                    if (userDetailResponseVal && !userDetailResponseVal[0]["error"]) {
                        this.userIDItems = userDetailResponseVal;
                        this.isadsConfig = true;
                        this.changeRef.markForCheck();
                    } else {
                        this.isadsConfig = false;
                    }
                    loaderConfigService.setLoadingSub('no');
                }
            );
        }
    }

    ngOnInit() {
        this.doInitClickSub();
        this.currentUserBranch = this.loaderConfig.getCustom('user_branch');
        let dataObj = this.loaderConfig.getCustom('ugPermission');
        if (dataObj != undefined)
            if (dataObj.length != 0)
                this.tempArrayCtrl.push(...dataObj);
        if (!this.userMaintenanceFormGroup.get('currency_code').value) {
            try {
                this.inputPickList.auxType = 'Currency';
                let pickListResponse = this.loaderConfig.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.inputPickList);
                pickListResponse.subscribe((pickListResponseData) => {
                    if (pickListResponseData) {
                        for (let ci = 0; ci < pickListResponseData.length; ci++) {
                            if (pickListResponseData[ci].currencyType === 'H') {
                                this.userMaintenanceFormGroup.get('currency_desc').patchValue(pickListResponseData[ci].desc);
                                this.userMaintenanceFormGroup.get('currency_desc').updateValueAndValidity();
                                this.userMaintenanceFormGroup.get('currency_code').patchValue(pickListResponseData[ci].code);
                                this.userMaintenanceFormGroup.get('currency_code').updateValueAndValidity();
                                break;
                            }
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }

        if (!this.userMaintenanceFormGroup.get('user_mobile').value) {
            this.mobileinputPickList.auxType = 'MiscInfo';
            this.mobileinputPickList.auxSubType = 'MOBCD';
            this.mobileinputPickList.param1 = environment.country;
            let mobilePickListResponse = this.loaderConfig.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.mobileinputPickList);
            mobilePickListResponse.subscribe((mobilePickListResponseData) => {
                if (mobilePickListResponseData[0]) {
                    this.userMaintenanceFormGroup.get('user_mobile').patchValue(mobilePickListResponseData[0].code + '-');
                    this.userMaintenanceFormGroup.get('user_mobile').updateValueAndValidity();
                }
            });
        }
        
    }
    ngAfterContentInit() {
        this.subscriber = this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });

        this.subscriber = this.userMaintenanceFormGroup.get('confirm_email').valueChanges.subscribe(data => {
            if (this.userFormValidator.passwordMismatch(this.userMaintenanceFormGroup.get('user_email').value, data)) {
                this.userMaintenanceFormGroup.get('confirm_email').setErrors({ 'mismatch': true });
            }
        });
        this.subscriber = this.userMaintenanceFormGroup.get('user_email').valueChanges.subscribe(data => {
            if (this.userFormValidator.passwordMismatch(data, this.userMaintenanceFormGroup.get('confirm_email').value)) {
                this.userMaintenanceFormGroup.get('confirm_email').setErrors({ 'mismatch': true });
            }
        });
        this.subscriber = this.userService.partyEE.subscribe((data) => {
            if (data === 'error') {
                this.errorFlag = true;
            } else {
                this.errorFlag = false;
            }
        });
        this.subscriber = this.userMaintenanceFormGroup.get('channel_type_code').valueChanges.subscribe(data => {
            this.userFormValidator.setValidatorForAgentOrAgency(this.userMaintenanceFormGroup);
            if (data === 'AG') {
                this.userMaintenanceFormGroup.controls['fullName'].patchValue('');
                this.userMaintenanceFormGroup.controls['fullName'].updateValueAndValidity();
            } else if (data === 'AO') {
                this.userMaintenanceFormGroup.controls['firstName'].patchValue('');
                this.userMaintenanceFormGroup.controls['firstName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['middleName'].patchValue('');
                this.userMaintenanceFormGroup.controls['middleName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['lastName'].patchValue('');
                this.userMaintenanceFormGroup.controls['lastName'].updateValueAndValidity();
            } else if (!data) {
                this.userMaintenanceFormGroup.controls['fullName'].patchValue('');
                this.userMaintenanceFormGroup.controls['fullName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['firstName'].patchValue('');
                this.userMaintenanceFormGroup.controls['firstName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['middleName'].patchValue('');
                this.userMaintenanceFormGroup.controls['middleName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['lastName'].patchValue('');
                this.userMaintenanceFormGroup.controls['lastName'].updateValueAndValidity();
            }
        });
        if (this.inputType === 'E') {
            this.userMaintenanceFormGroup.get('confirm_email').setValue(this.userMaintenanceFormGroup.get('user_email').value);
        }
        this.subscriber = this.userMaintenanceFormGroup.get('currency_code').valueChanges.subscribe(data => {
            if (data) {
                this.currencyCode = data;
            }
        });

        this.subscriber = this.userMaintenanceFormGroup.get('roleId').valueChanges.subscribe(data => {
            if (data === 'CST' || data === 'ADM') {
                this.userMaintenanceFormGroup.controls['user_group_code'].patchValue('');
                this.userMaintenanceFormGroup.controls['user_group_code'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['firstName'].patchValue('');
                this.userMaintenanceFormGroup.controls['firstName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['middleName'].patchValue('');
                this.userMaintenanceFormGroup.controls['middleName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['lastName'].patchValue('');
                this.userMaintenanceFormGroup.controls['lastName'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['userPermissions'].patchValue('');
                this.userMaintenanceFormGroup.controls['userPermissions'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['user_party_id'].patchValue('');
                this.userMaintenanceFormGroup.controls['user_party_id'].updateValueAndValidity();
                const arr = <FormArray>this.userMaintenanceFormGroup.controls['userGroupPermission']
                arr.controls = [];
                this.userMaintenanceFormGroup.controls['product_list'].patchValue('');
                this.userMaintenanceFormGroup.controls['product_list'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['user_agency_code'].patchValue('');
                this.userMaintenanceFormGroup.controls['user_agency_code'].updateValueAndValidity();
                this.userMaintenanceFormGroup.controls['creditLimitAmount'].patchValue('');
                this.userMaintenanceFormGroup.controls['creditLimitAmount'].updateValueAndValidity();
                if (data === 'CST') {
                    this.userMaintenanceFormGroup.controls['user_branch'].patchValue('');
                    this.userMaintenanceFormGroup.controls['user_branch'].updateValueAndValidity();
                }
                //this.partyIdMandatoryFlag = false;
            }
            this.userMaintenanceFormGroup.controls['channel_type_code'].patchValue('');
            this.userMaintenanceFormGroup.controls['channel_type_code'].updateValueAndValidity();
            this.userMaintenanceFormGroup.controls['channel_type_desc'].patchValue('');
            this.userMaintenanceFormGroup.controls['channel_type_desc'].updateValueAndValidity();
            this.userMaintenanceFormGroup = this.userFormValidator.setValidatorForRoleId(this.userMaintenanceFormGroup);
        });



    }

    doAction(event) {
        if (this.isChecked) {
            let userId = this.userMaintenanceFormGroup.controls['user_id'].value.split(' - ', 2);
            this.userMaintenanceFormGroup.controls['user_id'].patchValue(userId[0]);
            this.userMaintenanceFormGroup.controls['LDAP_Name'].patchValue(userId[1]);
            this.userMaintenanceFormGroup.controls['Auth_Mode'].patchValue('ADS');
        }
        this.doClick.emit(event);
    }
    doActionProcess(event) {
        this.doCheck.emit(event);
    }
    getUser(event) {
        for (let userDetail of this.userIDItems) {
            if (this.userMaintenanceFormGroup.controls['user_id'].value === userDetail['code']) {
                this.userMaintenanceFormGroup.controls['user_name'].patchValue(userDetail['username']);
            }
        }
    }
    getAdsConfig() {
        if (this.isChecked === false)
            this.isChecked = true;
        else if (this.isChecked === true)
            this.isChecked = false;
    }
    doInitClickSub() {
        this.eventHndler.changeSub.subscribe((data) => {
            if (data.id === "userGroupChangeId") {
                if (data.value.length > this.tempArrayCtrl.length) {
                    this.addPermission();
                    this.userFormValidator.setValidatorForUserGroupPermissions(this.userMaintenanceFormGroup);
                    this.permissionsArrayCtrl = data.value;
                    if (data.value.length > this.tempArrayCtrl.length) {
                        this.tempArrayCtrl = [];
                        for (let i = 0; i < data.value.length; i++)
                            this.tempArrayCtrl.push(data.value[i]);
                    }
                }
                else {
                    for (let i = 0; i < this.tempArrayCtrl.length; i++) {
                        let j;

                        for (j = 0; j < data.value.length; j++)
                            if (this.tempArrayCtrl[i] == data.value[j])
                                break;
                        if (j == data.value.length) {
                            this.removePermission(i);
                            this.tempArrayCtrl.splice(i, 1);
                        }
                    }
                }
            }
        });
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
    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    ngAfterViewChecked() {
        this.changeRef.detectChanges();
    }
}
