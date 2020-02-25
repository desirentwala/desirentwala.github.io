import { FormGroup, Validators } from '@angular/forms';

export class RoleFormValidator {
    roleForm: FormGroup;
    setRoleFormValidator(roleForm) {
        this.roleForm = roleForm;
        this.roleForm.get('roleId').setValidators(Validators.compose([Validators.required, Validators.minLength(3)]));
        this.roleForm.get('roleDesc').setValidators(Validators.compose([Validators.required, Validators.minLength(5)]));
        this.roleForm.get('systemRoleId').setValidators(Validators.compose([Validators.required]));
        return this.roleForm;
    }
}
