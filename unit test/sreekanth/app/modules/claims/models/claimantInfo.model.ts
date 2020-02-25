import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class ClaimantInfo {
    claimantInfo;
    questionnairesInfo;
    constructor(public claimModelInstance : DefaultClaimModel) {
        this.claimantInfo = this.claimModelInstance._formBuilderInstance;
        this.questionnairesInfo = this.claimModelInstance.getQuestionnairesInfo();
    }
    getClaimantInfoModel() {

        return this.claimantInfo.group({
            // claimantCode: [''],
            // claimantDesc: [''],
            // benefitClaimedCode: [''],
            // benefitClaimedDesc: [''],
            // lossCurrencyCode: [''],
            // lossCurrencyDesc: [''],
            // lossAmount: [''],
            // lossDate: [''],
            // placeOfLoss: [''],
            // natureOfLoss: [''],
            // portalRemarks: ['']
            claimNo: [''],
            claimCode: [''],
            claimCodeDesc: [''],
            claimantCd: [''],
            claimantCdDesc: [''],
            benefitClaimed: [''],
            benefitClaimedCode: [''],
            benefitClaimedDesc: [''],
            otherClaim: [''],
            claimantCurr: [''],
            claimantCurrDesc: [''],
            claimantAmount: [''],
            lossCurrencyCode: [''],
            lossCurrencyDesc: [''],
            lossAmount: [''],
            lossDate: [''],
            placeOfLoss: [''],
            natureOfLoss: [''],
            portalRemarks: [''],
            seq: [''],
            questionnaires: this.claimModelInstance._formBuilderInstance.array([
                this.questionnairesInfo.getQuestionnairesInfoModel()
            ])
        });
    }
}