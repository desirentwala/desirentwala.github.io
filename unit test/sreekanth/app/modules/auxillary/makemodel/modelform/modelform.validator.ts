import { FormGroup, Validators } from '@angular/forms';

export class ModelFormValidator {
    modelFormGroup: FormGroup;
    setModelFormValidator(modelFormGroup) {
        this.modelFormGroup = modelFormGroup;
        this.modelFormGroup.get('makeCode').setValidators(Validators.compose([Validators.required]));
        this.modelFormGroup.get('modelCode').setValidators(Validators.compose([Validators.required, Validators.minLength(2)]));
        this.modelFormGroup.get('modelCodeDesc').setValidators(Validators.compose([Validators.required, Validators.maxLength(256)]));
        return this.modelFormGroup;
    }
}
