import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class AdditionalInsurerInfo {
    _additionalInsurerInfoForm: FormBuilder;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._additionalInsurerInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getAdditionalInsurerInfomodel() {
        return this._additionalInsurerInfoForm.group({
            appID: [''],
            appFullName: [''],
            firstName: [''],
            lastName: [''],
            addrLine1: [''],
            addrLine2: [''],
            cityCode: [''],
            cityDesc: [''],
            stateCd: [''],
            stateDesc: [''],
            zip: [''],
            email: [''],
            cityAd:[''],
            stateAd:[''],
            typeOfCorport:[''],
            saveEmail:[''],
            streetname:[''],
            tradeID:[''],
            companyRegNumber:[''],
            companyName:[''],
            typeOfCorporateCode:[''],
            typeOfCorporateDesc:[''],
            key: [''],
            addapplicantName:[''],
            provinceTeritory:[''],
            provinceTeritoryDesc:[''],
            postalCode:[''],
            zipCode:[''],
            isActiveFlag: [true]
        });
    }
}
