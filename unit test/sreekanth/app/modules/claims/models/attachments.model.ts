import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class Attachments {
    attachmentsForm;
    constructor(public claimModelInstance: DefaultClaimModel) {
        this.attachmentsForm = this.claimModelInstance._formBuilderInstance;
    }
    getAttachmentsModel() {
        return this.attachmentsForm.group({
            noteID: [''],
            mimeType: [''],
            fileName: [''],
            documentContent: [''],
            seq: ['']
        });
    }
}