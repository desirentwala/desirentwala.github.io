import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class UasOperatingInfo {
    _uasOperatingInfoForm : FormBuilder;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._uasOperatingInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getUasOperatingInfoModel() {
        return this._uasOperatingInfoForm.group({
            appID: [' '],
            pilotOperatorName: [''],
            makModelUas: ['']
        });
    }
}
