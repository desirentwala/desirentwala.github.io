import { FormBuilder, FormGroup } from '@angular/forms';

export class UserGroupInfo {
    userGroupInfoForm: FormGroup;
    constructor(public userGroupInfoFormBuilder: FormBuilder) {
        this.userGroupInfoForm = userGroupInfoFormBuilder.group({
            branch_id:[''],
            branch_desc:[''],
            user_group_code: [''],
            user_group_desc: [''],
            user_group_users: [''],
            user_group_details : [''],
            startIndex: [0],
            maxRecords: [5],
            user_permissions:userGroupInfoFormBuilder.array([])
        });
    }
    getPartyidmodel() {
        return this.userGroupInfoFormBuilder.group({
            user_party_id: [''],
            channel_type_code: ['']
        });
    }
    getUserGroupInfoModel() {
        return this.userGroupInfoForm;
    }
    setUserGroupInfoModel(obj) {
        this.userGroupInfoForm.patchValue(obj);
        this.userGroupInfoForm.updateValueAndValidity();
    }
    getsearchmodal() {
        return this.userGroupInfoFormBuilder.group({
            branch_id: [''],
            user_group_code: [''],
            user_group_desc: [''],
            user_group_details: [],
            created_by: [''],
            branch_desc:[''],
        });
    }
    getUserPermissionsModel() {
        let permissionsForm = this.userGroupInfoFormBuilder.group({
            user_permissions: [''],
        });
        return permissionsForm;
    }

    getUserGroupListInfomodel() {
        return this.userGroupInfoFormBuilder.group({
            user_group_code: [''],
            user_group_desc: [''],
            branch_id: [''],
            branch_desc: [''],
            startIndex: 0,
            maxRecords: 5
        });
    }
}
