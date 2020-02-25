import { DefaultPolicyModel } from '../services/defaultModel.service';

export class CoverageLoadingInfo {
    _coverageLoadingInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._coverageLoadingInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getCoverageLoadingInfoModel() {
        return this._coverageLoadingInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            covgCd: [''],
            seqNo: [''],
            loadCode: [''],
            loadDesc: [''],
            limitType: [''],
            limitTypeDesc: [''],
            limitTypeCategory: [''],
            limitAmount: [''],
            limitPercent: [''],
            limitCount: [''],
            rate: [''],
            premium: [''],
            key: ['']
        });
    }

}