import { FormBuilder, FormGroup } from '@angular/forms';

export class PostalCodeInfo {
    postalCodeInfoForm: FormGroup;
    constructor(public postalCodeInfoFormBuilder: FormBuilder) {
        this.postalCodeInfoForm = postalCodeInfoFormBuilder.group({
            zipId:[''],
            zipCode: [''],
            zipName: [''],
            countryCode: [''],
            countryCodeDesc:[''],
            stateCode: [''],
            stateCodeDesc:[''],
            districtCode: [''],
            districtCodeDesc:[''],
            cityCode: [''],
            cityCodeDesc:[''],
            zipArea: [''],           
            zipAddr1: [''],
            zipAddr2: [''],
            zipAddr3: [''],
            zipAddr4: [''],
            zipAddr5: [''],
            timeZone: [''],
            startIndex: 0,
            maxRecords: 5
        });
    }
    getPostalCodeInfoModel() {
        return this.postalCodeInfoForm;
    }
    getPostalCodeListInfoModel() {
        return this.postalCodeInfoFormBuilder.group({
            zipCode: [''],
            zipName: [''],
            countryCode: [''],
            countryCodeDesc:[''],
            stateCode: [''],
            stateCodeDesc:[''],
            districtCode: [''],
            cityCode: [''],
            zipArea: [''],           
            zipAddr1: [''],
            zipAddr2: [''],
            zipAddr3: [''],
            zipAddr4: [''],
            zipAddr5: [''],
            timeZone: [''],
            startIndex: 0,
            maxRecords: 5
        });
    }
    setPostalCodeInfo(obj) {
        this.postalCodeInfoForm.patchValue(obj);
        this.postalCodeInfoForm.updateValueAndValidity();
    }
}
