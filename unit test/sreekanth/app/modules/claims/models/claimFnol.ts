import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class ClaimFnolInfo {

    policyInfo;
    documentInfo;
    claimInfo;
    customerInfo;
    insuredInfo;
    selectedInsuredInfo;
    claimantInfo;
    attachments;
    claimCodeReserveList;
    emailQuotInfo;
    constructor(public claimModelInstance: DefaultClaimModel) {

        let _policyInfo = claimModelInstance.getPolicyInfo();
        this.policyInfo = _policyInfo;
        let _documentInfo = claimModelInstance.getDocumentInfo();
        this.documentInfo = _documentInfo;
        let _claimInfo = claimModelInstance.getClaimInfo();
        this.claimInfo = _claimInfo;
        let _customerInfo = claimModelInstance.getCustomerInfo();
        this.customerInfo = _customerInfo;
        let _claimantInfo = claimModelInstance.getClaimantInfo();
        this.claimantInfo = _claimantInfo;
        let _insuredInfo = claimModelInstance.getInsuredInfo();
        this.insuredInfo = _insuredInfo;
        let _selectedInsuredInfo = claimModelInstance.getSelectedInsuredInfo();
        this.selectedInsuredInfo = _selectedInsuredInfo;
        let _attachments = claimModelInstance.getAttachments();
        this.attachments = _attachments;

let _emailQuotInfo = claimModelInstance.getEmailQuotInfo();
        this.emailQuotInfo = _emailQuotInfo;

        let _claimCodeReserveList = claimModelInstance.getClaimCodeReserveInfo();
        this.claimCodeReserveList = _claimCodeReserveList;

    }

    getClaimFnolInfoModel() {
        return this.claimModelInstance._formBuilderInstance.group({
            policyInfo: this.policyInfo.getPolicyInfoModel(),
            claimInfo: this.claimInfo.getClaimInfoModel(),
            customerInfo: this.customerInfo.getCustomerInfoModel(),
            documentInfo: this.claimModelInstance._formBuilderInstance.array([
                this.documentInfo.getDocumentInfoModel(),
            ]),
            claimantInfo: this.claimModelInstance._formBuilderInstance.array([
                this.claimantInfo.getClaimantInfoModel(),
            ]),
            insuredInfo: this.claimModelInstance._formBuilderInstance.array([
                this.insuredInfo.getInsuredInfoModel(),
            ]),
            selectedInsuredInfo: this.claimModelInstance._formBuilderInstance.array([
                this.selectedInsuredInfo.getSelectedInsuredInfoModel(),
            ]),
            attachments: this.claimModelInstance._formBuilderInstance.array([
                this.attachments.getAttachmentsModel(),
            ]),
            claimCodeReserveList: this.claimModelInstance._formBuilderInstance.array([
                this.claimCodeReserveList.getClaimCodeReserveInfoModel(),
            ]),
            emailQuotInfo: this.emailQuotInfo.getEmailQuotInfoModel()
        });
    }
}