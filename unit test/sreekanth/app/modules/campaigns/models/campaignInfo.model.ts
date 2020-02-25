import { DefaultPolicyModel } from '../../common/services/defaultModel.service';

export class CampaignInfo {
    campaignInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this.campaignInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getEmailInfoModel() {
        return this.campaignInfoForm.group({
            toAddress: [''],
            subject: [''],
            fileUpload: [''],
            reason: [''],
            templateName: [''],
            ccAddress: [''],
            fromAddress: ['']
        });
    }
    getAttachmentsModel() {
        return this.campaignInfoForm.group({
            fileName: [''],
            strContent: [''],
            key: [''],
            type: ['']
        });
    }
    getCampaignInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            emailCampaignInfo: this.getEmailInfoModel(),
            attachments: this.quoteModelInstance._formBuilderInstance.array([
                this.getAttachmentsModel(),
            ])
        });
    }
}