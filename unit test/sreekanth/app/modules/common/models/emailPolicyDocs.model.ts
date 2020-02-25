import { DefaultPolicyModel } from '../services/defaultModel.service';

export class EmailPolicyDocs {
    _emailPolicyDocsForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._emailPolicyDocsForm = this.quoteModelInstance._formBuilderInstance;
    }
    getEmailPolicyDocsModel() {
        return this._emailPolicyDocsForm.group({
            toAddress: [''],
            subject: [''],
            categary: [''],
            message: [''],
            templateName: [''],
            ccAddress: [''],
            fromAddress: [''],
            isSmsRequired: [''],
            mobileNumber: [''],
            smsLanguage: ['']
        });
    }
}