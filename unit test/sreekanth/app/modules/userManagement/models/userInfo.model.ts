import { FormBuilder, FormGroup } from '@angular/forms';

export class UserInfo {
    userInfoForm: FormGroup;

    constructor(public userInfoFormBuilder: FormBuilder) {
        this.userInfoForm = userInfoFormBuilder.group({
            user_id: [''],
            user_name: [''],
            user_prf_group_code: [''],
            user_prf_group_desc: [''],
            user_group_code: [''],
            user_group_desc: [''],
            user_party_id: [''],
            user_parent: [''],
            user_parent_name: [''],
            user_status: [''],
            channel_type_code: [''],
            channel_type_desc: [''],
            product_list: [''],
            user_email: [''],
            confirm_email: [''],
            user_mobile: [''],
            user_home: [''],
            user_office: [''],
            user_fax: [''],
            user_lang_code: [''],
            user_lang_desc: [''],
            region: [''],
            user_type: [''],
            user_type_desc: [''],
            user_agency_code: [''],
            user_subAgency_code: [''],
            user_branch: [''],
            user_technical: [''],
            user_valid_from: [''],
            user_expiry_date: [''],
            currency_code: [''],
            currency_desc: [''],
            creditLimitAmount: [''],
            firstName: [''],
            middleName: [''],
            lastName: [''],
            fullName: [''],
            parent_user_id: [''],
            parent_user_name: [''],
            page_url: [''],
            details: this.getDetailsInfo(),
            LDAP_Name: [''],
            Auth_Mode: [''],
            roleId: [''],
            user_branch_desc: [],
            roleId_desc: [''],
            user_group_details: [''],
            userGroupPermission: userInfoFormBuilder.array([]),
            userPermissions: [''],
            country_code: [''],
            country_desc: [''],
            client_party_id: ['']
        });
    }
    getPartyidmodel() {
        return this.userInfoFormBuilder.group({
            user_party_id: [''],
            channel_type_code: ['']
        });
    }
    getUserInfoModel() {
        return this.userInfoForm;
    }
    getUserListInfomodel() {
        return this.userInfoFormBuilder.group({
            user_id: [''],
            user_name: [''],
            user_prf_group_code: [''],
            user_prf_group_desc:[''],
            roleId: [''],
            roleId_desc:[''],
            user_branch: [''],
            user_branch_desc: [''],
            user_status:[''],
            startIndex: 0,
            maxRecords: 5
        });
    }
    setUserInfoModel(obj) {
        this.userInfoForm.patchValue(obj);
        this.userInfoForm.updateValueAndValidity();
    }
    getsearchmodal() {
        return this.userInfoFormBuilder.group({
            user_name: [true],
            user_id: [true],
            user_prf_group_desc: [true],
            roleId_desc: [true],
            user_branch: [true],
        });
    }

    getDetailsInfo() {
        let detailsForm = this.userInfoFormBuilder.group({
            channelId: [''],
            channelType: [''],
            state_code: [''],
            state_desc: ['']
        });
        return detailsForm;
    }

    getUserPermissionsModel() {
        let permissionsForm = this.userInfoFormBuilder.group({
            userGroupPermission: [''],
        });
        return permissionsForm;
    }
}
