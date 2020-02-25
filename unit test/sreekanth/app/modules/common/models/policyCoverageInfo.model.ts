import { DefaultPolicyModel } from '../services/defaultModel.service';

export class PolicyCoverageInfo {
    _PolicyCoverageInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._PolicyCoverageInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getPolicyCoverageInfoModel() {

        return this._PolicyCoverageInfoForm.group({
            covgCd: [''],
            covgDesc: [''],
            covgCat: [''],
            covgCatDesc: [''],
            covgSubCat: [''],
            covgSubCatDesc: [''],
            covgRt: [''],
            ovFlag: [''],
            covgSi: [''],
            covgPrm: [''],
            covgRecalculate: [''],
            key: ['']
        });
    }

}
