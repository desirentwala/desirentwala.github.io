import { DefaultPolicyModel } from '../services/defaultModel.service';

export class InstalmentItemInfo {
    _instalmentItemInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._instalmentItemInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getInstalmentItemInfoModel() {
        return this._instalmentItemInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            accountCode: [''],
            instalmentNo: [''],
            instalmentDate: [''],
            instalmentPercentage: [''],
            premiumPrime: [''],
            premiumBase: [''],
            instalmentDueMonth:[''],
            clientPremiumPrime: [''],
            clientPremiumBase: [''],
            netPremiumPrime: [''],
            netPremiumBase: [''],
            siCurr: [''],
            siCurrRate: [''],
            premCurr: [''],
            premCurrRate: [''],
            key: ['']
        });
    }

}