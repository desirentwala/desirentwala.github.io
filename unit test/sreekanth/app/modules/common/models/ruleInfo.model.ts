import { FormBuilder } from '@angular/forms';

export class RuleInfo {
    _ruleForm;
    constructor(public _formBuilderInstance: FormBuilder) {
        this._ruleForm = this._formBuilderInstance;
    }

    getRuleInfoModel() {
        return this._ruleForm.group({
            moduleID: [''],
            projectID: [''],
            effectiveDate: [''],
            object: [''],
            ruleSetList: [''],
            productCd: [''],
            serviceName: [''],
            source: ['']
        });
    }
}