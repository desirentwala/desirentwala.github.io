import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class DocumentInfo {
    documentInfoForm;
    constructor(public claimModelInstance : DefaultClaimModel) {
        this.documentInfoForm = this.claimModelInstance._formBuilderInstance;
    }
    getDocumentInfoModel() {

        return this.documentInfoForm.group({
            document: [''],
            documentDesc: [''],
            recievedFlag: [''],
            recievedDate: [''],
            key: [''],
            receivedBy: [''],
            docChkListId:[''],
            raised_By:[''],
            requestedDate:['']
        });
    }
}