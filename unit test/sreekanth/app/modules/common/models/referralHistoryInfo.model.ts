import { DefaultPolicyModel } from '../services/defaultModel.service';

export class ReferralHistoryInfo {
    _referralHistoryInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._referralHistoryInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getReferralHistoryInfoModel() {

        return this._referralHistoryInfoForm.group({
            referralTransKey: [''],
            referralID: [''],
            referredTimestamp: [''],
            author: [''],
            category: [''],
            referralRemarks: ['']
        });
    }
}
