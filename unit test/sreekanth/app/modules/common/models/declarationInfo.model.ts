import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class DeclarationInfo {
    declarationInfoForm: FormBuilder;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this.declarationInfoForm = this.defaultModelService._formBuilderInstance;
    }
    getDeclarationInfoModel() {
        return this.declarationInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            declNumber: [''],
            fromDate: [''],
            toDate: [''],
            dueDate: [''],
            provisionalSI: [''],
            key: [''],
            declarationItemSectionInfo: this.declarationInfoForm.array([
            ]),
        });
    }
}