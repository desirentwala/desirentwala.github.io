import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class DeclarationItemSectionInfo {
    declarationItemSectionInfoForm: FormBuilder;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this.declarationItemSectionInfoForm = this.defaultModelService._formBuilderInstance;
    }
    getDeclarationItemSectionInfoModel() {
        return this.declarationItemSectionInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            declNumber: [''],
            itemNo: [''],
            sectNo: [''],
            subItemNo: [''],
            subSectionNo: [''],
            siCurr: [''],
            siCurrDesc: [''],
            siCurrRt: [''],
            provisionalSI: [''],
            key: [''],
            declarationCoverageInfo: this.declarationItemSectionInfoForm.array([
            ]),
        });
    }
}