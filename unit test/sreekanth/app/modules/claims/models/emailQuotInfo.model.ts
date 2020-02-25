import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class EmailQuotInfo {
    _emailQuotInfoForm;
    constructor(public quoteModelInstance : DefaultClaimModel){
        this._emailQuotInfoForm=this.quoteModelInstance._formBuilderInstance;
    }
    getEmailQuotInfoModel() {
        return this._emailQuotInfoForm.group({
            toAddress: [''],
            subject: [''],
            fileUpload: [''],
            reason: [''],
            templateName: [''],
            ccAddress: [''],
            fromAddress: ['']
        });
    }
}