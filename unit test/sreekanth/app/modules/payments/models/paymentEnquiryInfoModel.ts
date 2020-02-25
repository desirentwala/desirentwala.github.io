import { DefaultPolicyModel } from '../../common/services/defaultModel.service';

export class PaymentEnquiryInfoModel {
    enquiryInfoForm;

    constructor(public enquiryModelInstance: DefaultPolicyModel) {
        this.enquiryInfoForm = this.enquiryModelInstance._formBuilderInstance;
    }
    getBatchInfoModel() {
        return this.enquiryInfoForm.group({
            amount: [''],
            amountTypeCode: [''],
            amountTypeDesc: [''],
            isCommission: [false],
            isAmtSelected: [false],
            selectAllOption: [''],
            totalPayAmount: [''],
            paymentInfo: this.enquiryModelInstance.getPaymentInfo().getPaymentInfoModel(),
        });
    }
    getBatchFilterInfoModel() {
        return this.enquiryInfoForm.group({
            agentCode: [''],
            dueFromDate: [''],
            dueToDate: [''],
            product: [''],
            productCode: [''],
            clientCode: [''],
            policyNo: [''],
            startRow: [''],
            size: ['']
        });
    }
    getBatchSettlementInfoModel() {
        return this.enquiryInfoForm.group({
            agentCode: [''],
            prefix: [''],
            currency: [''],
            amount: [''],
            exchangeRate: [''],
            micrNo: [''],
            ifscCode: [''],
            transRefNo: [''],
            accountHolder: [''],
            particulars: [''],
            altRef: [''],
            bankCode: [''],
            policyEndorsements: this.enquiryInfoForm.array([

            ]),
            paymentInfo: this.enquiryModelInstance.getPaymentInfo().getPaymentInfoModel()
        });
    }
    getPolicyEndorsementsInfoModel() {
        return this.enquiryInfoForm.group({
            policyNo: [''],
            endtNo: [''],
            isCommision: ['']
        })
    }
}
