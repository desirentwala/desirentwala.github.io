import {DefaultPolicyModel} from '../services/defaultModel.service';

export class DocumentInfo {
    _documentInfoForm;
    constructor(public quoteModelInstance : DefaultPolicyModel) {
        this._documentInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getDocumentInfoModel() {

        return this._documentInfoForm.group({
            documentId: [''],
            documentDesc: [''],
            requestType: [''],
            dispatchType: [''],
            key: [''],
            isDocumentSelected: [''],
            quoteNo:['']
        });
    }
}