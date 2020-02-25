import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class NomineeInfo {
    nomineeInfoForm: FormBuilder;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this.nomineeInfoForm = this.defaultModelService._formBuilderInstance;
    }
    getNomineeInfo() {
        return this.nomineeInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            subItemNo: [''],
            subSectionNo: [''],
            appFName: [''],
            appLName: [''],
            appFullName: [''],
            identityTypeCode: [''],
            identityTypeDesc: [''],
            identityNo: [''],
            relationshipToInsuredCode: [''],
            relationshipToInsuredDesc: [''],
            nomineeShare: [''],
            nomineeAmount: [''],
            nomineeShareFlag: [''],
            applicableCoverage: [''],
            role: [''],
            nomineeID: [''],
            remarks: [''],
            nomineeType: [''],
            nomineeCoverages: [''],
            selectedCoverages: [''],
            seqNo: [''],
            key: ['']
        });
    }
}