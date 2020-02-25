import { FormBuilder, FormGroup } from '@angular/forms';

export class RoleInfo {
    roleInfoForm: FormGroup;
    constructor(public roleInfoFormBuilder: FormBuilder) {
        this.roleInfoForm = roleInfoFormBuilder.group({
            roleId: [''],
            roleDesc: [''],
            systemRoleId: [''],
            systemRoleDesc: ['']
        });
    }

    getRoleInfoModel() {
        return this.roleInfoForm;
    }

    getsearchmodal() {
        return this.roleInfoFormBuilder.group({
            roleId: [true],
            roleDesc: [true],
            systemRoleId: [true],
            oprId: [true]
        });
    }

    getRoleListInfomodel() {
        return this.roleInfoFormBuilder.group({
            roleId: [''],
            roleDesc: [''],
            systemRoleId: [''],
            startIndex: 0,
            maxRecords: 5,
        });
    }

    setRoleInfoModel(obj) {
        this.roleInfoForm.patchValue(obj);
        this.roleInfoForm.updateValueAndValidity();
    }
}