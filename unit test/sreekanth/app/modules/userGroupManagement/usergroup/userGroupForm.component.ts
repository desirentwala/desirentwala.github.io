import { UserGroupService } from './../services/userGroup.service';
import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';

import { ConfigService } from '../../../core/services/config.service';
import { UserGroupFormValidator } from './userGroupForm.validator';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { EventService } from '../../../core/services/event.service';
import { PickList } from '../../common/models/picklist.model';



@Component({
    selector: 'usergroup-form',
    templateUrl: 'userGroupForm.component.html'
})

export class UserGroupFormComponent implements OnInit, AfterContentInit {
    @Input() userGroupMaintenanceFormGroup: FormGroup;
    @Input() technicalUserList: any = [];
    @Input() parentUserIDList: any = [];
    @Input() inputType = 'N';
    @Input() branchId = '';
    user_permissions: FormArray;
    userBranchCode: string;
    formBuilder: FormBuilder;
    userGroupFormValidator;
    todayDate: Date;
    loaderConfig: ConfigService;
    public todayString: string;
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public doCheck: EventEmitter<any> = new EventEmitter<any>();
    errorFlag: boolean = false;
    userPickList = new PickList();
    ugPermList = new PickList();
    permissionsArray: any = [];
    tempUsers: any = [];
    userLength: number = 0;
    permissionsArrayCtrl: any = [];
    tempArrayCtrl: any = [];
    usersPermissionsArray: FormArray;
    eventHndler: EventService;

    constructor(public userInfoForm: FormBuilder,
        public userGroupService: UserGroupService,
        public utilsService: UtilsService,
        public _logger: Logger,
        public translate: TranslateService,
        public loaderConfigService: ConfigService,
        public _eventHandler: EventService,
        public changeRef: ChangeDetectorRef) {
        this.eventHndler = _eventHandler;
        this.userGroupMaintenanceFormGroup = this.userGroupService.getuserGroupFormModel();
        this.userGroupMaintenanceFormGroup.patchValue(this.userGroupService.getuserGroupFormModel().value);
        this.userGroupFormValidator = new UserGroupFormValidator();
        this.userGroupFormValidator.setUserGroupFormValidator(this.userGroupMaintenanceFormGroup);
        this.loaderConfig = loaderConfigService;
    }

    ngOnInit() {
        this.doInitChangeSub();
        this.userBranchCode = this.loaderConfigService.getCustom('user_branch');
        let dataObj = this.loaderConfig.getCustom('controlPermission');
        if (dataObj != undefined)
            if (dataObj.length != 0)
                this.tempArrayCtrl.push(...dataObj);
            this.setUsersToTemp(this.userGroupMaintenanceFormGroup.get('user_group_users'));
    }

    ngAfterContentInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });

        this.loaderConfig.setLoadingSub('no');
    }

    doAction(event) {
        this.doClick.emit(event);
    }

    doActionProcess(event) {
        this.doCheck.emit(event);
    }

    doInitChangeSub() {
        this.eventHndler.changeSub.subscribe((data) => {
            if (data.id === "userGroupUsersChangeId") {
                if (data.value.length > this.tempUsers.length) {
                    this.addPermission();
                    this.userGroupFormValidator.setValidatorForUserPermissions(this.userGroupMaintenanceFormGroup);
                    this.setUsersToTemp(data);
                } else if (data.value.length < this.tempUsers.length) {
                    this.userGroupFormValidator.setValidatorForUserPermissions(this.userGroupMaintenanceFormGroup);
                    this.user_permissions = this.userGroupMaintenanceFormGroup.get('user_permissions') as FormArray;
                    let isPermissionRemoved: boolean = false;
                    for (let i = 0; i < data.value.length; i++) {
                        if (this.tempUsers[i] !== data.value[i].code) {
                            this.user_permissions.removeAt(i);
                            isPermissionRemoved = true;
                            break;
                        }
                    }
                    if (!isPermissionRemoved) {
                        this.user_permissions.removeAt(this.tempUsers.length - 1);
                    }
                    this.setUsersToTemp(data);
                }
            } else if (data.id === 'branchChangeId') {
                if (data.value) {
                    this.branchId = data.value;
                    this.reset();
                    this.changeRef.markForCheck();
                }

            }
        });
    }
    setUsersToTemp(data) {
        this.tempUsers = [];
        for (let i = 0; i < data.value.length; i++) {
            this.tempUsers.push(data.value[i].code);
        }
    }
    reset() {
       let arrayType: any = this.userGroupMaintenanceFormGroup.controls['user_permissions'];
        while (arrayType.length !== 0) {
            arrayType.removeAt(0)                 
        };
        this.userGroupMaintenanceFormGroup.get('user_group_users').reset();
        this.userGroupMaintenanceFormGroup.get('user_group_users').updateValueAndValidity();
        this.userGroupMaintenanceFormGroup.get('user_group_desc').reset();
        this.userGroupMaintenanceFormGroup.get('user_group_code').reset();
        this.userGroupMaintenanceFormGroup.get('user_permissions').reset();
        this.userGroupMaintenanceFormGroup.get('user_permissions').updateValueAndValidity();
        this.tempUsers = []; 
    }  
    addPermission(): void {
        this.user_permissions = this.userGroupMaintenanceFormGroup.get('user_permissions') as FormArray;
        this.user_permissions.push(this.createPermission());
        let user_permissionsArray: FormArray = <FormArray>this.userGroupMaintenanceFormGroup.get('user_permissions');
        for (let i = 0; i < user_permissionsArray.controls.length; i++) {
        user_permissionsArray.at(i).get('user_permissions').setValidators(Validators.compose([Validators.required]));         
        }
    }
    
    createPermission() {
        return this.userGroupService.getUserPermissionsModel();
    }
}
