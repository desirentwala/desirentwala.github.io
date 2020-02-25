import { FormGroup, Validators } from '@angular/forms';

export class makemodelFormGroupValidator {
    makemodelFormGroup: FormGroup;
    setmakemodelFormGroupValidator(makemodelFormGroup) {
        this.makemodelFormGroup = makemodelFormGroup;
        this.makemodelFormGroup.get('modelCode').setValidators(Validators.compose([Validators.required, Validators.minLength(2)]));
        this.makemodelFormGroup.get('modelCodeDesc').setValidators(Validators.compose([Validators.required, Validators.maxLength(100)]));
        this.makemodelFormGroup.get('make').setValidators(Validators.compose([Validators.required]));
        return this.makemodelFormGroup;
    }
}
