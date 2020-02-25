import { FormGroup, Validators, FormArray } from '@angular/forms';
import { EmailIdvalidators } from '../../../core/ui-components/validators/emailid/emailid.validator';

export class UserFormValidator {
    userForm: FormGroup;
    setUserFormValidator(userForm) {
        this.userForm = userForm;
        this.userForm.get('user_id').setValidators(Validators.compose([Validators.required, Validators.minLength(6)]));
        this.userForm.get('user_name').setValidators(Validators.compose([Validators.required]));
        this.userForm.get('user_status').setValidators(Validators.compose([Validators.required]));
        this.userForm.get('user_lang_code').setValidators(Validators.compose([Validators.required]));
        this.userForm.get('user_email').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.userForm.get('confirm_email').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.userForm.get('user_valid_from').setValidators(Validators.compose([Validators.required]));
        this.userForm.get('user_expiry_date').setValidators(Validators.compose([Validators.required]));
        this.userForm.get('user_mobile').setValidators(Validators.compose([Validators.maxLength(15)]));
        this.userForm.get('user_prf_group_code').setValidators(Validators.compose([Validators.required]));
        this.userForm.get('roleId').setValidators(Validators.compose([Validators.required]));
        this.userForm.get('country_code').setValidators(Validators.compose([Validators.required]));
        return this.userForm;
    }
    passwordMismatch(userPwd, confirmPwd) {
        if (userPwd !== confirmPwd) {
            return true;
        } else {
            return false;
        }
    }

    setValidatorForAgentOrAgency(userForm) {
        this.userForm = userForm;
        let data = this.userForm.get('channel_type_code').value;
        if (data === 'AG') {
            this.userForm.get('firstName').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('lastName').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('fullName').setValidators(null);
            this.userForm.get('fullName').updateValueAndValidity();
        } else if (data === 'AO') {
            this.userForm.get('fullName').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('firstName').setValidators(null);
            this.userForm.get('firstName').updateValueAndValidity();
            this.userForm.get('lastName').setValidators(null);
            this.userForm.get('lastName').updateValueAndValidity();
        } else if (!data) {
            this.userForm.get('fullName').clearValidators();
            this.userForm.get('fullName').updateValueAndValidity();
            this.userForm.get('firstName').clearValidators();
            this.userForm.get('firstName').updateValueAndValidity();
            this.userForm.get('lastName').clearValidators();
            this.userForm.get('lastName').updateValueAndValidity();
        }
        return this.userForm;
    }

    setValidatorForUserGroupPermissions(userForm) {
        this.userForm = userForm;
        let data = this.userForm.get('user_group_code').value;
        if (data) {
            let userGroupPermissionArray: FormArray = this.userForm.get('userGroupPermission') as FormArray;
            for (let i = 0; i < userGroupPermissionArray.controls.length; i++) {
                userGroupPermissionArray.at(i).get('userGroupPermission').setValidators(Validators.compose([Validators.required]));
            }
        }
        return this.userForm;
    }

    setValidatorForRoleId(userForm) {
        this.userForm = userForm;
        let data = this.userForm.get('roleId').value;

        if (data === 'ADM') {
            this.userForm.get('user_branch').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('userPermissions').updateValueAndValidity();
            this.userForm.get('userPermissions').clearValidators();
            this.userForm.get('userPermissions').updateValueAndValidity();
            this.userForm.get('channel_type_code').clearValidators();
            this.userForm.get('channel_type_code').updateValueAndValidity();
            this.userForm.get('user_party_id').clearValidators();
            this.userForm.get('user_party_id').updateValueAndValidity();
        } else if (data === 'CST') {
            this.userForm.get('user_branch').clearValidators();
            this.userForm.get('user_branch').updateValueAndValidity();
            this.userForm.get('userPermissions').clearValidators();
            this.userForm.get('userPermissions').updateValueAndValidity();
            this.userForm.get('channel_type_code').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('channel_type_code').updateValueAndValidity();
            this.userForm.get('user_party_id').clearValidators();
            this.userForm.get('user_party_id').updateValueAndValidity();
            this.userForm.get('client_party_id').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('client_party_id').updateValueAndValidity();
        } else if (data === 'OPR') {
            this.userForm.get('user_branch').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('user_branch').updateValueAndValidity();
            this.userForm.get('userPermissions').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('userPermissions').updateValueAndValidity();
            this.userForm.get('channel_type_code').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('channel_type_code').updateValueAndValidity();
            this.userForm.get('user_party_id').setValidators(Validators.compose([Validators.required]));
            this.userForm.get('user_party_id').updateValueAndValidity();
        }

        if (data !== 'ADM' || data !== 'CST') {
            this.userForm.get('userPermissions').setValidators(Validators.compose([Validators.required]));
        }
        if (data !== 'CST') {
            this.userForm.get('client_party_id').clearValidators();
            this.userForm.get('client_party_id').updateValueAndValidity();
        }
        if (data === 'OPR') {
            this.userForm.get('user_party_id').setValidators(Validators.compose([Validators.required]));
        } else {
            this.userForm.get('user_party_id').clearValidators();
            this.userForm.get('user_party_id').updateValueAndValidity();
        }
        return this.userForm;
    }
}
