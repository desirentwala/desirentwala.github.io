import { DefaultPolicyModel } from '../services/defaultModel.service';

export class AdditionalRiskInfo {
    _additionalRiskInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._additionalRiskInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getAdditionalRiskInfoModel() {
        return this._additionalRiskInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            additionalText1: [''],
            additionalText2: [''],
            additionalText3: [''],
            additionalText4: [''],
            additionalText5: [''],
            additionalText6: [''],
            additionalText7: [''],
            additionalNumber1: [''],
            additionalKey: [''],
            key: ['']
        });
    }

}