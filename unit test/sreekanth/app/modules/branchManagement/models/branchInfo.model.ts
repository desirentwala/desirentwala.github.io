import { FormBuilder, FormGroup } from '@angular/forms';

export class BranchInfo {
    branchInfoForm: FormGroup;
    constructor(public branchInfoFormBuilder: FormBuilder) {
        this.branchInfoForm = branchInfoFormBuilder.group({
            branch_id: [''],
            branch_desc: [''],
            branch_loc: [''],
            parent_branch_id: [''],
            parent_branch_desc: [''],
            address1: [''],
            address2: [''],
            city: [''],
            state: [''],
            pin: [''],
            country: [''],
            country_desc: [''],
            startIndex: ['0'],
            maxRecords: ['5'],
        });
    }

    getBranchInfoModel() {
        return this.branchInfoForm;
    }

    getsearchmodal() {
        return this.branchInfoFormBuilder.group({
            branch_id: [true],
            branch_desc: [true],
            branch_loc: [true],
            parent_branch_id: [true],
        });
    }

    getBranchListInfomodel() {
        return this.branchInfoFormBuilder.group({
            user_branch: [''],
            user_branch_desc: [''],
            branch_id: [''],
            branch_desc: [''],
            branch_loc: [''],
            parent_branch_id: [''],
            parent_branch_desc: [''],
            city: [''],
            state: [''],
            country: [''],
            country_desc: [''],            
            startIndex: 0,
            maxRecords: 5,
        });
    }

    setBranchInfoModel(obj) {
        this.branchInfoForm.patchValue(obj);
        this.branchInfoForm.updateValueAndValidity();
    }
}