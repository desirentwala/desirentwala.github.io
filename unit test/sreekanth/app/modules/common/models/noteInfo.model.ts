import { DefaultPolicyModel } from '../services/defaultModel.service';

export class NoteInfo {
    _noteInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel ) {
        this._noteInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getNoteInfoModel() {
        return this._noteInfoForm.group({
            referenceNo: [''],
            referenceType: ['RTUW'],
            isNewNote: [''],
            noteTitle: [''],
            attachments: this._noteInfoForm.array([
                this.getfileuploadModel(),
            ]),
        });
    }
    getfileuploadModel() {
        return this._noteInfoForm.group({
            noteID: [''],
            mimeType: [''],
            fileName: [''],
            documentContent: ['']
        });
    }
}