import {DefaultPolicyModel} from '../services/defaultModel.service';

export class EmailQuotInfo {
    _EmailQuotInfoForm;
    constructor(public quoteModelInstance : DefaultPolicyModel){
        this._EmailQuotInfoForm=this.quoteModelInstance._formBuilderInstance;
    }
    getEmailQuotInfoModel() {
        return this._EmailQuotInfoForm.group({
            toAddress: [''],
            subject: [''],
            categary: [''],
            reason: [''],
            templateName: [''],
            ccAddress: [''],
            fromAddress: [''],
            productBrochure: ['']
        });
    }
}