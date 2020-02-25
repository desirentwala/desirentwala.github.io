import { DefaultPolicyModel } from '../services/defaultModel.service';

export class ClaimHistoryInfo {
    _claimHistoryInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._claimHistoryInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getClaimHistoryInfoModel() {
        return this._claimHistoryInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            seqNo: [''],
            claimedYear: [''],
            claimedYearCode: [''],
            claimedCount: [''],
            natureOfLossCode: [''],
            natureOfLossDesc: [''],
            claimTypeCode: [''],
            claimTypeCodeDesc: [''],
            key: ['']
        });
    }

}