import { FormGroup, Validators } from '@angular/forms';

export class PostalCodeFormValidator {
    postalCodeForm: FormGroup;
    setPostalCodeFormValidator(postalCodeForm) {
        this.postalCodeForm = postalCodeForm;
        this.postalCodeForm.get('zipCode').setValidators(Validators.compose([Validators.required, Validators.maxLength(10)]));
        this.postalCodeForm.get('zipName').setValidators(Validators.compose([Validators.required, Validators.maxLength(40)]));
        this.postalCodeForm.get('countryCode').setValidators(Validators.compose([Validators.required, Validators.maxLength(25)]));
        this.postalCodeForm.get('stateCode').setValidators(Validators.compose([Validators.required, Validators.maxLength(25)]));
        this.postalCodeForm.get('districtCode').setValidators(Validators.compose([Validators.required, Validators.maxLength(25)]));
        this.postalCodeForm.get('cityCode').setValidators(Validators.compose([Validators.required, Validators.maxLength(25)]));
        this.postalCodeForm.get('zipArea').setValidators(Validators.compose([Validators.required, Validators.maxLength(25)]));
        this.postalCodeForm.get('zipAddr1').setValidators(Validators.compose([Validators.required, Validators.maxLength(255)]));
        return this.postalCodeForm;
    }
}
