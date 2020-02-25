import { FormBuilder } from '@angular/forms';

export class EnquiryInfoModel {
    enquiryInfoForm;

    constructor(_enquiryInfoForm: FormBuilder) {
        this.enquiryInfoForm = _enquiryInfoForm;
    }
    getEnquiryInfoModel() {
        return this.enquiryInfoForm.group({
            clientName: [''],
            clientCode: [''],
            agentCode: [''],
            agentName: [''],
            quoteNo: [''],
            policyNo: [''],
            claimNo: [''],
            clientPhoneNo: [''],
            clientEmail: [''],
            product: [''],
            status: [''],
            quoteExpiringInDays: [''],
            startIndex: ['0'],
            maxRecords: ['5'],
            lossDateFrom: [''],
            noticeDateFrom: [''],
            subOrdinateUser: [''],
            expiryDate: [''],
            inceptionDate: [''],
            identityNo: [''],
            productCode: [''],
            statusCode: [''],
            fromDate: [''],
            toDate: [''],
            policiesExpiringInDays: [''],
            ownTransaction: true,
            userGroupCode: [''],
            statusDesc: [''],
            sharedBy: [''],
            vehicleRegNo:[''],
            sharedBySuperUser: false,
            sharedByUser: false,
            txnType: [''],
			shareTransaction: false,
            alternateNo:[''],
            accountName:[''],
            quoteDate:[''],
            quoteExpiryDate:[''],
            accountType:[''],
            remarks:[''],
            underwriter:[''],
            clientFullName:[''],
            enteredBy:[''],
            subordinateUser: [''],
            quoteVerNo: [''],
            selectAllWithSamePartyId : false,
            isHierarchySearch : false
        });
    }

    getQuotInfoHeader() {
        return this.enquiryInfoForm.group({
            quoteNo: [true],
            clientFullName: [true],
            productDesc: [true],
            issueDate: [true],
            statusDesc: [true],
            issuedBy: [true]
        });
    }

    getPolicyInfoHeader() {
        return this.enquiryInfoForm.group({
            policyNo: [true],
            clientFullName: [true],
            endtReasonCodeDesc: [true],
            productDesc: [true],
            issueDate: [true],
            expiryDate: [true],
            statusDesc: [true],
            planTypeDesc: [true],
            issuedBy: [true]
        });
    }

    getReceiptInfoHeader() {
        return this.enquiryInfoForm.group({
            clientFullName: [true],
            policyNo: [true],
            productDesc: [true],
            premium: [true],
            receipt: [true],
            source: [true]
        });
    }

    getClaimInfoHeader() {
        return this.enquiryInfoForm.group({
            claimNo: [true],
            clientFullName: [true],
            policyNo: [true],
            productDesc: [true],
            lossDateFrom: [true],
            noticeDateFrom: [true],
            statusDesc: [true],
            issuedBy: [true]
        });
    }
    getRenewalInfoHeader() {
        return this.enquiryInfoForm.group({
            policyNo: [true],
            clientName: [true],
            productDesc: [true],
            expiryDate: [true],
            premium: [true],
            statusDesc: [true]
        });
    }
    quoteInfoSearchByModal() {
        return this.enquiryInfoForm.group({
            clientFullName: [''],
            quoteNo: [''],
            identityNo: [''],
            productDesc: [''],
            issueDate: [''],
            statusDesc: ['']
        });
    }
    getClaimInfoModel() {
        return this.enquiryInfoForm.group({
            claimInfo: this.getEnquirySearchInfoModel()
        });
    }
    getQuotorPolicyInfoModel() {
        return this.enquiryInfoForm.group({
            policyInfo: this.getEnquirySearchInfoModel()
        });
    }

    getQuoteInfoModel() {
        return this.enquiryInfoForm.group({
            quoteInfo: this.getEnquirySearchInfoModel()
        });
    }
    getEnquirySearchInfoModel() {

        return this.enquiryInfoForm.group({
            quoteNo: [''],
            quoteVerNo: [''],
            policyNo: [''],
            identityNo: [''],
            status: [''],
            statusDesc: [''],
            productCd: [''],
            policyEndtNo: [''],
            branchCd: [''],
            claimNo: [''],
            userId: [''],
            agentCd: [''],
            startIndex: ['0'],
            maxRecords: ['5']
        });
    }

    resetfilterModel() {
        return this.enquiryInfoForm.group({
            clientName: [''],
            quoteNo: [''],
            policyNo: [''],
            identityNo: [''],
            clientPhoneNo: [''],
            clientEmail: [''],
            product: [null],
            status: [null],
            quoteExpiringInDays: [''],
            ownTransaction: true,
            startIndex: ['0'],
            maxRecords: ['5'],
            userId: [''],
            agentCd: ['']
        });
    }

    getEmailDocumentsInfoModel() {

        return this.enquiryInfoForm.group({
            fromAddress: [''],
            toAddress: [''],
            ccAddress: [''],
            bccAddress: [''],
            subject: [''],
            emailBody: [''],
            emailMessage: [''],
            isDocumentSelected: [''],
            selectAllOption: [''],
            sendAttachedFiles: [''],
            messageType: [''],
            emailTemplateIdList: [''],
            policyNo: [''],
            policyEndtNo: [''],
            effectiveDt: [''],
            serviceName: ['']
        });
    }

    getBatchInfoModel() {
        return this.enquiryInfoForm.group({
            amount: [''],
            amountTypeCode: [''],
            amountTypeDesc: [''],
            isCommission: [false],
            isAmtSelected: [false],
            selectAllOption: [''],
            totalPayAmount: ['']
        });
    }

    getBorRequestModel(){
        return this.enquiryInfoForm.group({
            clientName: [''],
            borRequestedBy: [''],
            introducingAgentPortalId: [''],
            borRequestedDate: [''],
            borChangedDate:[''],
            borAttachments: this.enquiryInfoForm.array([
                this.getfileuploadModel(),
            ])
        });
    }

    getfileuploadModel() {
        return this.enquiryInfoForm.group({
            noteID: [''],
            mimeType: [''],
            fileName: [''],
            documentContent: [''],
        });
    }
}
