import { DefaultPolicyModel } from '../services/defaultModel.service';

export class RidersInfo {
    ridersInfo;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this.ridersInfo = this.defaultModelService._formBuilderInstance;
    }

    getRiderInfoModel() {
        return this.ridersInfo.group({
            riderCode: [''],
            riderDesc: [''],
            riderSA: [''],
            riderTerm: [''],
            riderYearlyPremium: [''],
            riderSinglePremium: [''],
            premiumFA:[''],
            key:[''],
            appCode:[''],
            premiumYearlyFA:[''],
            premiumSingleFA:[''],
            partyRole:[''],
            quoteNo:[''],
            quoteVerNo:[''],
            classification:['O'],
            main_Type:[''],
            sub_Type:[''],
            lifeAssured_By:[''],
            partyDesc:[''],
            funding_Flag:['BT'],
            funding_Method:['EP'],
            riderLevel:[''],
            premiumTerm:[]
        });
    }
}