import { DefaultPolicyModel } from '../services/defaultModel.service';

export class FilterInfo {
    _filterInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel ) {
        this._filterInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getFilterInfoModel() {
        return this._filterInfoForm.group({
            auxType: [''],
            auxSubType: [''],
            param1: [''],
            param2: [''],
            param3: [''],
            param4: ['']
        });
    }
}