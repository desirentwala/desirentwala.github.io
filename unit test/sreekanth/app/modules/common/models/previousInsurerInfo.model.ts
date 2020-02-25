import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class PreviousInsurerInfo {
    _previousInsurerInfoForm: FormBuilder;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._previousInsurerInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getPreviousInsurerInfomodel() {
        return this._previousInsurerInfoForm.group({
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
            key: ['']
        });
    }
}
