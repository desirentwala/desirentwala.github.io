import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class ReferDocumentInfo {
    referDocumentInfoForm;
    constructor(public claimModelInstance : DefaultClaimModel){
        this.referDocumentInfoForm=this.claimModelInstance._formBuilderInstance;
    }
    getReferQuotInfoModel() {

        return this.referDocumentInfoForm.group({
            processType: [''],
            referenceNo: [''],
            remarks: [''],
            fileName: [''],
            contentType: [''],
            content: ['']
        });
    }
}