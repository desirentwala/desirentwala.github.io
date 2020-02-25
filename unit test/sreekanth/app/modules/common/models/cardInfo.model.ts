import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class CardInfo {
    cardInfoForm: FormBuilder;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this.cardInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getAutoRenewalInfoModel() {
        return this.cardInfoForm.group({
            isAutoRenewalApplicable: [''],
            instructionType: [''],
            cardType: [''],
            issuingBankCode: [''],
            issuingBankName: [''],
            creditCardNo: [''],
            cardExpiryMonth: [''],
            cardExpiryYear: ['']
        })
    }
}