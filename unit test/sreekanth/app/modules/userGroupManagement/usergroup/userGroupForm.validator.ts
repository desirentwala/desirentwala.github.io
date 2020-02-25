import { FormGroup, Validators } from '@angular/forms';

export class UserGroupFormValidator {
    userGroupForm: FormGroup;

    setUserGroupFormValidator(userGroupForm) {
        this.userGroupForm = userGroupForm;
        this.userGroupForm.get('branch_id').setValidators(Validators.compose([Validators.required]));
        this.userGroupForm.get('user_group_code').setValidators(Validators.compose([Validators.required]));
        this.userGroupForm.get('user_group_desc').setValidators(Validators.compose([Validators.required]));
        this.userGroupForm.get('user_group_users').setValidators(Validators.compose([Validators.required]));

        return this.userGroupForm;
    }

    setValidatorForUserPermissions(userGroupForm) {
        this.userGroupForm = userGroupForm;
        let data = this.userGroupForm.get('user_group_users').value;
        if(data){
            this.userGroupForm.get('user_permissions').setValidators(Validators.compose([Validators.required]));
        }
        return this.userGroupForm;
    }
}
