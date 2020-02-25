import { FormGroup, Validators } from '@angular/forms';

export class MakeFormValidator {
    makemodelFormGroup: FormGroup;
    setMakeFormValidator(makemodelFormGroup) {
        this.makemodelFormGroup = makemodelFormGroup;
        this.makemodelFormGroup.get('makeCode').setValidators(Validators.compose([Validators.required, Validators.minLength(2)]));
        this.makemodelFormGroup.get('makeCodeDesc').setValidators(Validators.compose([Validators.required, Validators.maxLength(256)]));
        return this.makemodelFormGroup;
    }
}
