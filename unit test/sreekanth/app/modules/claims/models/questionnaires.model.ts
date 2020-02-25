import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class QuestionnairesInfo {
    questionnairesInfoForm;

    constructor(public claimModelInstance : DefaultClaimModel ) {
        this.questionnairesInfoForm = this.claimModelInstance._formBuilderInstance;
    }

    getQuestionnairesInfoModel() {
        return this.questionnairesInfoForm.group({           
			claimNo: [""],
			benefitClaimed: [""],
			claimantCd: [""],
			questionSeqNo: [""],
			question: [""],
			questionType: [""],
			questionAnswer: [""]
        });
    }
   
}