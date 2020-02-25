import { DefaultPolicyModel } from '../services/defaultModel.service';
export class PaymentInfo {
    _paymentInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._paymentInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getPaymentInfoModel() {

        return this._paymentInfoForm.group({
            voucherNumber: [''],
            paymentDate: [''],
			paymentTime: [''],
            paymentReferenceNo: [''],
            creditCardNo: [''],
            cardType: [''],
            ccExpiryDate: [''],
            paymentType: ['CASH'],
            depositBank: [''],
            depositBankName: [''],
            chequeNo: [''],
            chequeDate: [''],
            draweeBank: [''],
            draweeBankName: [''],
            payOn: [''],
            cvv: [''],
            nameOnCard: [''],
            validTillMonth: [''],
            validTillYear: [''],
            amount: [''],
            status: [''],
            policyNo: [''],
            policyEndtNo:[''],
            responseCode: [''],
            responseDesc: ['']
        });
    }
}