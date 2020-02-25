import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class SelectedInsuredInfo {
    selectedInsuredInfoForm;
    constructor(public claimModelInstance : DefaultClaimModel) {
        this.selectedInsuredInfoForm = this.claimModelInstance._formBuilderInstance;
    }
    getSelectedInsuredInfoModel() {
        return this.selectedInsuredInfoForm.group({
            appFullName: [''],
            relationship: ['']
        });
    }
}