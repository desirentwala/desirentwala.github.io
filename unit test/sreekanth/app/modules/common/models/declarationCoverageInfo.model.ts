import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class DeclarationCoverageInfo {
    declarationCoverageInfoForm: FormBuilder;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this.declarationCoverageInfoForm = this.defaultModelService._formBuilderInstance;
    }
    getDeclarationCoverageInfoModel() {
        return this.declarationCoverageInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            declNumber: [''],
            itemNo: [''],
            sectNo: [''],
            subItemNo: [''],
            subSectionNo: [''],
            covgCd: [''],
            covgDesc: [''],
            coverageGrpCode: [''],
            coverageGrpDesc: [''],
            siCurr: [''],
            siCurrDesc: [''],
            siCurrRt: [''],
            provisionalSI: [''],
            key: ['']
        });
    }
}