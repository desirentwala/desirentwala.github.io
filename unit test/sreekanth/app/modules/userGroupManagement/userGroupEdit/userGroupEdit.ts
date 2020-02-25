import { ChangeDetectorRef, Component, AfterContentInit, OnInit,OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';

import { ConfigService } from '../../../core/services/config.service';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { Logger } from './../../../core/ui-components/logger/logger';
import { UserGroupService } from './../services/userGroup.service';

@Component({
    selector: 'user-edit',
    templateUrl: 'userGroupEdit.html'
})

export class UserGroupEditComponent implements OnInit, AfterContentInit {
    public userGroupMaintenanceFormGroup: FormGroup;
    public isValidUpdateUserGroupForm: boolean = true;
    loaderConfig;
    updateUserGroupModal = false;
    dateFormatService;
    branchModal;
    branchId: string;
    isError = false;
    errors = [];
    user_permissions: FormArray;
    constructor(public userInfoForm: FormBuilder,
        public _logger: Logger,
        public userGroupService: UserGroupService,
        loaderConfigService: ConfigService,
        public ConfigService: ConfigService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.userGroupMaintenanceFormGroup = this.userGroupService.getuserGroupFormModel();
        this.userGroupMaintenanceFormGroup.get('user_group_code').disable();
        this.userGroupMaintenanceFormGroup.get('user_group_code').disable();
        this.userGroupMaintenanceFormGroup.get('branch_id').disable();
        this.userGroupMaintenanceFormGroup.get('user_group_desc').disable();
    }

    ngOnInit() {
        this.userGroupFormDataInit();
        this.userClick();
        /* this.doInitChangeSub();
        this.doInitClickSub();
        this.changeRef.detectChanges(); */
    }

    ngAfterContentInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
        this.loaderConfig.setLoadingSub('no');
    }

    userGroupFormDataInit(): void {

        this.loaderConfig.setLoadingSub('yes');
        let dataObj = this.loaderConfig.getCustom('userGroupDetails');
        if(dataObj && dataObj.user_permissions){
            for (let i = 0; i < dataObj.user_permissions.length; i++) {
                this.addPermission();
            }
            this.loaderConfig.setCustom('controlPermission', dataObj.user_permissions);
            this.userGroupMaintenanceFormGroup.patchValue(dataObj);
        }
    }
    userClick(){
     let dataObj = this.loaderConfig.getCustom('userGroupDetails');   
     if (dataObj.branch_id){
          this.branchId = dataObj.branch_id;
        this.changeRef.markForCheck();

     }      

   } 

    updateUserGroupDetails() {
        this.isValidUpdateUserGroupForm = this.userGroupMaintenanceFormGroup.valid;
        this.userGroupMaintenanceFormGroup.get('user_group_code').enable();
        this.userGroupMaintenanceFormGroup.get('user_group_desc').enable();
        let userGroupUsers = this.userGroupMaintenanceFormGroup.get('user_group_users').value;
        let userPermissions = this.userGroupMaintenanceFormGroup.get('user_permissions').value;

        let userGroupDetails = new Array();
        let tempJson = {};
       
        for (let i = 0; i < userGroupUsers.length; i++) {
            tempJson['user_id'] = userGroupUsers[i].code;
            userGroupDetails.push(tempJson);
            tempJson = {};
        }
        let tempString = '';
      
        for (let i = 0; i < userPermissions.length; i++) {
             if(userPermissions[i].user_permissions && userPermissions[i].user_permissions.length>0){
            userPermissions[i].user_permissions.forEach(element => {
                tempString = element.code + '|' + tempString;
            });
            userGroupDetails[i]['user_permissions'] = tempString;
            tempString = '';
        }
        }
        this.userGroupMaintenanceFormGroup.get('user_group_details').patchValue(userGroupDetails);
        let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.userGroupService.getuserGroupFormModel().value);
        let updatedArray: any[] = [];
        updatedArray.push(this.userGroupService.getuserGroupFormModel().value);
        if (this.isValidUpdateUserGroupForm) {
            let updateUserGroupDetailResponse = this.userGroupService.updateUserGroup(updatedArray);
            updateUserGroupDetailResponse.subscribe(
                (responseData) => {
                    if (responseData.error) {
                        this._logger.error('UpdateUserGroup() ===>' + responseData.error);
                    } else {
                        if (responseData.status === true) {
                            this.updateUserGroupModal = true;
                        }
                        this.loaderConfig.setLoadingSub('no');
                    }
                }
            );
          
        }
        else {
            window.scroll(200, 200);
        }
    }

    navigateUserGroupList() {
        this.updateUserGroupModal = false;
        this.ConfigService.navigateRouterLink('ncp/userGroupManagement/userGroupList');
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
    ngAfterViewChecked() {
        this.changeRef.detectChanges();
    }
    
}


