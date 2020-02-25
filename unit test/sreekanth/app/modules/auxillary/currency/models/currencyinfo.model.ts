import { FormBuilder, FormGroup } from '@angular/forms';
export class CurrencyInfo {
    currencyInfoForm: FormGroup;
    constructor(public currencyInfoFormBuilder: FormBuilder) {
        this.currencyInfoForm = currencyInfoFormBuilder.group({
            currencyType:[''],
            currencyCode:[''],
            currencyCodeDesc:[''],
            currencyRate:[''],
            startIndex : 0,
            maxRecords : 5,
        });
    }
    getCurrencyInfoModel() {
        return this.currencyInfoForm;
    }
    getCurrencyListInfoModel() { 
        return this.currencyInfoFormBuilder.group({
            currencyType:[''],
            currencyCode:[''],
            currencyCodeDesc:[''],
            currencyRate:[''],
            startIndex : 0,
            maxRecords : 5, 
        });
    }
    setCurrencyInfo(obj) {
        this.currencyInfoForm.patchValue(obj);
        this.currencyInfoForm.updateValueAndValidity();
    }
}
