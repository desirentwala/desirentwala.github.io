import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class UploadedDocumentInfo {
    uploadedDocumentInfoForm;
    constructor(public claimModelInstance : DefaultClaimModel) {
        this.uploadedDocumentInfoForm = this.claimModelInstance._formBuilderInstance;
    }
    getUploadedDocumentInfoModel() {
        return this.uploadedDocumentInfoForm.group({
            documentName: [''],
            documentType: [''],
            documentContent: [''],
            seq: ['']
        });
    }
}