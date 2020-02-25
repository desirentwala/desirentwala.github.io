import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class InsuredInfo {
    insuredInfoForm;
    constructor(public claimModelInstance : DefaultClaimModel) {
        this.insuredInfoForm = this.claimModelInstance._formBuilderInstance;
    }
    getInsuredInfoModel() {
        return this.insuredInfoForm.group({
            appFullName: [''],
            relationship: ['']
        });
    }
}