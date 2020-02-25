import { DefaultPolicyModel } from '../services/defaultModel.service';

export class ReferQuotInfo {
    _ReferQuotInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._ReferQuotInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getReferQuotInfoModel() {

        return this._ReferQuotInfoForm.group({
            referTo: [''],
            subject: [''],
            category: [''],
            referralRemarks: [''],
            referralTransKey: [''],
            referralID: [''],
            technicalUserList: [''],
            referralChannelType:['M'],
            isReferralActive:['N'],
            process:[''],
            referralType:[''],
            referralSource:[''],
            referralReason:[''],
            lastActionBy:[''],
            mvmtType:[''],
            client:[''],
            attachments: this._ReferQuotInfoForm.array([
                this.getfileuploadModel(),
            ]),
            ccAddress: ['']
        });
    }
    getfileuploadModel() {
        return this._ReferQuotInfoForm.group({
            noteID: [''],
            mimeType: [''],
            fileName: [''],
            documentContent: [''],
        });
    }
}