import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../../common/services/defaultModel.service';

export class CustomerPersonalDetails {
    customerPersonalDetailsForm;
    customerInfo;

    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this.customerPersonalDetailsForm = this.quoteModelInstance._formBuilderInstance;
        let customerInfo = quoteModelInstance.getCustomerInfo();
        this.customerInfo = customerInfo;
    }

    getCustomerDetailsBySearch() {

        return this.customerPersonalDetailsForm.group({
            clientName: [''],
            clientPhoneNo: [''],
            clientEmail: [''],
            identityNo: [''],
            subOrdinateUser: [''],
            ownTransaction: true,
            userGroupCode: [''],
            statusDesc: [''],
            sharedBy: [''],
            shareTransaction: false
        });
    }

    getCheckBoxArrayForCustomerDetails() {
        return this.customerPersonalDetailsForm.group({
            clientName: [true],
            clientMobile: [true],
            clientEmail: [true],
            customerID: [true],
            address: [true],
            clientType:[true]
        });
    }

    CustomerpolicyInfo() {
        return this.customerPersonalDetailsForm.group({
            quoteNo: [''],
            quoteVerNo: [''],
            policyNo: [''],
            status: [''],
            productCd: [''],
            policyEndtNo: ['']
        });
    }

    getCustomerpolicyInfo() {
        return this.customerPersonalDetailsForm.group({
            policyInfo: this.CustomerpolicyInfo(),
        });
    }

    getCustomerDetailsForm() {
        return this.customerPersonalDetailsForm.group({
            customerInfo: this.customerInfo.getCustomerInfoModel(),
        });
    }

}
