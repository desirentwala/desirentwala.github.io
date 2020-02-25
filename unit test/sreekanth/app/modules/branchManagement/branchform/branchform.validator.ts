import { FormGroup, Validators } from '@angular/forms';

export class BranchFormValidator {
    branchForm: FormGroup;
    setBranchFormValidator(branchForm) {
        this.branchForm = branchForm;
        this.branchForm.get('branch_id').setValidators(Validators.compose([Validators.required, Validators.minLength(2)]));
        this.branchForm.get('branch_desc').setValidators(Validators.compose([Validators.required, Validators.maxLength(100)]));
        this.branchForm.get('branch_loc').setValidators(Validators.compose([Validators.required]));
        this.branchForm.get('address1').setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
        this.branchForm.get('address2').setValidators(Validators.compose([Validators.maxLength(50)]));
        this.branchForm.get('city').setValidators(Validators.compose([Validators.required]));
        this.branchForm.get('state').setValidators(Validators.compose([Validators.required]));
        this.branchForm.get('pin').setValidators(Validators.compose([Validators.required, Validators.maxLength(6)]));
        this.branchForm.get('country').setValidators(Validators.compose([Validators.required]));
        return this.branchForm;
    }
}
