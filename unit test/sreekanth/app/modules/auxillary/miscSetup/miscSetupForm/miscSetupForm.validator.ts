import { FormGroup, Validators } from '@angular/forms';

export class MiscSetupFormValidator {
    miscSetupForm: FormGroup;
    setPostalCodeFormValidator(miscSetupForm) {
        this.miscSetupForm = miscSetupForm;
        this.miscSetupForm.get('miscType').setValidators(Validators.compose([Validators.required, Validators.maxLength(4)]));
        this.miscSetupForm.get('miscCode').setValidators(Validators.compose([Validators.required, Validators.maxLength(4)]));
        this.miscSetupForm.get('miscCodeDesc').setValidators(Validators.compose([Validators.required, Validators.maxLength(255)]));
        this.miscSetupForm.get('effectiveFrom').setValidators(Validators.compose([Validators.required]));
        this.miscSetupForm.get('effectiveTo').setValidators(Validators.compose([Validators.required]));
        return this.miscSetupForm;
    }
}
