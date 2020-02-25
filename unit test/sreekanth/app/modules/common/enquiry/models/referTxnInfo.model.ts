import { FormBuilder } from '@angular/forms';

export class ReferTxnInfoModel {
    referTxnInfoModel;

    constructor(_referTxnInfo: FormBuilder) {
        this.referTxnInfoModel = _referTxnInfo;
    }
    getReferTxnInfoModel() {
        return this.referTxnInfoModel.group({
            reqId : [''],
            txnId : [''],
            txnType : [''],
            txnVerNO : [''],
            reqBy : [''],
            referralStatus : [''],
            requestType : [''],
            remarks : [''],
            requestDate : [''],
            oprId : [''],
            approver : [''],
            txnStatus : [''],
            ownerId: [''],
            productCd: [''],
            rejectType: ['FINAL'],
            reasonForApproval: [''],
            reasonForApprovalDesc: [''],
            reasonForReferral: [''],
            appFullName: [''],
            clientType: [''],
            accountType: [''],
            reasonForDecline: [''],
            reasonForDeclineDesc: [''],
            submissionDate: [''],
            startIndex: 0,
            maxRecords: 5,
            others: [''],
            othersDesc: [''],
            docRemarks: [''],
            othersDecline: [''],
            othersDescDecline: [''],
            customerId:[''],
            attachments: this.referTxnInfoModel.array([
                this.getfileuploadModel(),
            ])

        });
    }

    getfileuploadModel() {
        return this.referTxnInfoModel.group({
            noteID: [''],
            mimeType: [''],
            fileName: [''],
            remarks:[''],
            documentContent: [''],
        });
    }

    getReferTxnSearchInfoModel() {
        return this.referTxnInfoModel.group({
            txnId : [''],
            txnType : [''],
            txnVerNO : [''],
            reqBy : [''],
            referralStatus : [''],
            requestType : [''],
            remarks : [''],
            requestDate : [''],
            oprId : [''],
            approver : [''],
            txnStatus : [''],
            ownerId: [''],
            productCd: [''],
            appFullName: [''],
            clientType: [''],
            accountType: [''],
            startIndex: 0,
            maxRecords: 5,
            reasonForReferral:['']
        });
    }
}
