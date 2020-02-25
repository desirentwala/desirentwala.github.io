import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';

import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { UserGroupService } from '../services/userGroup.service';
import { UserGroupFormValidator } from '../usergroup/userGroupForm.validator';

@Component({
    selector: 'newUserGroup',
    templateUrl: 'newUserGroup.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewUserGroupComponent  {
    public userGroupMaintenanceFormGroup;
    userGroupFormValidator;
    userGroupInfo;
    isValidCreateUserGroupForm;
    loaderConfig;
    userpartyFormgroup: FormGroup;
    createUserGroupModal = false;
    isError = false;
    errors = [];
    childBranchesUserList = [];
    parentUserIDList = [];
    public subscribedMap = {};
    constructor(public userInfoForm: FormBuilder,
        public userGroupService: UserGroupService,
        public _logger: Logger,
        public changeRef: ChangeDetectorRef,
        public ConfigService: ConfigService,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public utilsService: UtilsService,
    ) {
        this.loaderConfig = loaderConfigService;

        this.userGroupMaintenanceFormGroup = this.userGroupService.getuserGroupFormModel();
        this.userGroupFormValidator = new UserGroupFormValidator();
        this.userGroupMaintenanceFormGroup = this.userGroupFormValidator.setUserGroupFormValidator(this.userGroupMaintenanceFormGroup);
    }

    createNewUserGroup() {
        this.isValidCreateUserGroupForm = this.userGroupMaintenanceFormGroup.valid;
        let userGroupdetailArray: any[] = [];
        this.errors = [];
        this.userGroupMaintenanceFormGroup = this.userGroupService.getuserGroupFormModel();
        let userGroupUsers = this.userGroupMaintenanceFormGroup.get("user_group_users").value;
        let userPermissions = this.userGroupMaintenanceFormGroup.get("user_permissions").value;
        let userGroupDetails = new Array();
        let tempJson = {};
        for (let i = 0; i < userGroupUsers.length; i++) {
            tempJson["user_id"] = userGroupUsers[i].code;
            userGroupDetails.push(tempJson);
            tempJson = {};
        }
        let tempString = "";
        for (let i = 0; i < userPermissions.length; i++) {
             if(userPermissions[i].user_permissions && userPermissions[i].user_permissions.length>0){
            userPermissions[i].user_permissions.forEach(element => {
                tempString = element.code + "|" + tempString;
            });
            userGroupDetails[i]["user_permissions"] = tempString
            tempString = "";
        }
         }
        this.userGroupMaintenanceFormGroup.get("user_group_details").patchValue(userGroupDetails);

        userGroupdetailArray.push(this.userGroupMaintenanceFormGroup.value);
        if (this.isValidCreateUserGroupForm) {

            let userGroupDetailResponse = this.userGroupService.doCreateUserGroup(userGroupdetailArray);
            userGroupDetailResponse.subscribe(
                (createUsergoupDetail) => {
                    if (createUsergoupDetail.error !== null && createUsergoupDetail.error !== undefined && createUsergoupDetail.error.length >= 1) {
                        this.isError = true;
                        this.errors.push({ 'errCode': createUsergoupDetail.error[1].errCode, 'errDesc': createUsergoupDetail.error[1].errDesc });
                        this._logger.error('doCreateBranch() ===>' + createUsergoupDetail.error);
                        window.scrollTo(150, 150);
                        this.changeRef.markForCheck();
                    } else {
                        this.createUserGroupModal = true;
                        this._logger.log('user group created');
                        this.loaderConfig.setLoadingSub('no');
                        this.changeRef.markForCheck();
                    }
                }
            );
        }
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

    navigateList() {
        this.ConfigService.navigateRouterLink('ncp/userGroupManagement/userGroupList');
    }
}
