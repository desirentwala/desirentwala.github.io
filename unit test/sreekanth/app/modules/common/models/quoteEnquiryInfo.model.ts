import {DefaultPolicyModel} from '../services/defaultModel.service';

export class QuoteEnquiryInfo {
    _quoteEnquiryInfoForm;
    constructor(public quoteModelInstance : DefaultPolicyModel) {
        this._quoteEnquiryInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getquoteEnquiryInfoModel() {

        return this._quoteEnquiryInfoForm.group({
            clientName: [''],
            quoteNo: [''],
            clientPhoneNo: [''],
            clientEmail: [''],
            product: [null],
            status: [null],
            quoteExpiringInDays: [''],
            startIndex: ['0'],
            maxRecords: ['5']
        });
    }
    getQuotOpenHeldInfoModel() {
        return this._quoteEnquiryInfoForm.group({
            policyInfo: this.getquoteHeldEnquiryInfoModel()
        });
    }
    getquoteHeldEnquiryInfoModel() {

        return this._quoteEnquiryInfoForm.group({
            quoteNo: [''],
            quoteVerNo: [''],
            status: [''],
            productCd: ['']
        });
    }
}
