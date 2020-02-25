import { FormGroup, Validators } from '@angular/forms';

export class CurrencyFormValidator {
    currencyForm: FormGroup;
    setCurrencyFormValidator(currencyForm) {
        this.currencyForm = currencyForm;
        this.currencyForm.get('currencyType').setValidators(Validators.compose([Validators.required, Validators.maxLength(1)]));
        this.currencyForm.get('currencyCode').setValidators(Validators.compose([Validators.required, Validators.maxLength(4)]));
        this.currencyForm.get('currencyCodeDesc').setValidators(Validators.compose([Validators.required, Validators.maxLength(30)]));
        this.currencyForm.get('currencyRate').setValidators(Validators.compose([Validators.required,Validators.maxLength(12)]));
        return this.currencyForm;
    }
}
