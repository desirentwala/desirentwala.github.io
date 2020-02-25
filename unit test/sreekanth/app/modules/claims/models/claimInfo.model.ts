import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class ClaimInfo {
    claimInfoForm;
    claimTempDetailsInfo;
    claimantInfo;
    constructor(public claimModelInstance: DefaultClaimModel) {
        this.claimInfoForm = this.claimModelInstance._formBuilderInstance;
        this.claimTempDetailsInfo = this.claimModelInstance.getClaimTempDetailsInfo();
        this.claimantInfo = this.claimModelInstance.getClaimantInfo();
    }

    getClaimInfoModel() {
        return this.claimInfoForm.group({
            claimNo: [''],
            status: [''],
            noticeBy: [''],
            noticeByDesc: [''],
            nonExstParty: [''],
            nonPartyclientDesc: [''],
            notifierType: [''],
            notifierClientCode: [''],
            notifierClientFullName: [''],
            notifierClientFirstName: [''],
            notifierClientLastName: [''],
            notifierClientMobile: [''],
            nonPartyClientMobile: [''],
            notifierClientEmail: [''],
            nonPartyClientEmail: [''],
            noticeDate: [''],
            lossDate: [''],
            lossTime: [''],
            noticeTime: [''],
            placeOfLossCodeDesc: [''],
            placeOfLossCode: [''],
            incidentDesc: [''],
            mvmtNo: [''],
            movementType: [''],
            claimantName: [''],
            otherClaimantName: [''],
            claimantRelationCode: [''],
            claimantRelationDesc: [''],
            mailTheChequeToAgent: [''],
            statusDesc: [''],
            estimatedLossAmount: [''],
            claimType: [''],
            claimTypeDesc: [''],
            notifierDetails :[''],
            lifeAssuredContact: [''],
            lifeAssuredDesc: [''],
            lifeAssuredCd: [''],
            claimReason:[''],
            claimReasonDesc:[''],
            claimSubType: [''],
            claimSubTypeDesc: [''],
            lifeAssuredFName:[],
            lifeAssuredLName:[],
            noticeSeries: []
        });
    }
}