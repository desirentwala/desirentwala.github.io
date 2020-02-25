import { DefaultPolicyModel } from '../services/defaultModel.service';

export class ErrorInfo {
    _errorInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._errorInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getErrorInfo() {
        return this._errorInfoForm.group({
            policyNo: [''],
            errCode: [''],
            errDesc: [''],
            errType: [''],
            isSelected: [''],
            seqNo: [''],
            key:['']
        });
    }
}