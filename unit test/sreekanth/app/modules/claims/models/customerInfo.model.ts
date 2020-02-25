import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class CustomerInfo {
    customerInfoForm;
    constructor( public claimModelInstance : DefaultClaimModel) {
        this.customerInfoForm = this.claimModelInstance._formBuilderInstance;
    }
    getCustomerInfoModel() {
        return this.customerInfoForm.group({
            appCode: [''],
            appFullName: [''],
            appFName: [''],
            appLName: ['']
        });
    }

}