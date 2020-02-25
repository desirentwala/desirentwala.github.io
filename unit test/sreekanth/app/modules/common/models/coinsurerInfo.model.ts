import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class CoinsurerInfo {
    coinsurerInfoForm: FormBuilder;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this.coinsurerInfoForm = this.defaultModelService._formBuilderInstance;
    }
    getCoinsurerInfoModel() {
        return this.coinsurerInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            appName: [''],
            appNameDesc: [''],
            sharePercent: [''],
            feePercent: [''],
            sumInsured: [''],
            premium: [''],
            coInsuranceGrossNet: [''],
            key: ['']
        });
    }
}