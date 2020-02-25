import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class AviationUsageInfo {
    _aviationUsageInfoForm: FormBuilder;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._aviationUsageInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getAviationUsageInfo() {
        return this._aviationUsageInfoForm.group({
            appID: [' '],
            additionalEquipments:[''],
            additionalDesc:[''],
            additionalCode:[''],
            additionalType:[''],
            additionalSlno:[''],
            additionalValue:[''],
            key: ['']
        });
    }
}
