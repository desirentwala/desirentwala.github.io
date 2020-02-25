import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class ClaimTempDetailsInfo {
    claimTempDetailsInfo;
    constructor(public claimModelInstance : DefaultClaimModel) {
        this.claimTempDetailsInfo = this.claimModelInstance._formBuilderInstance;
    }
    getClaimTempDetailsInfoModel() {

        return this.claimTempDetailsInfo.group({
            claimantName: [''],
            claimantCode: [''],
            claimantDesc: [''],
            claimantRelationCode:[''],
            claimantRelationDesc:['']
        });
    }
}