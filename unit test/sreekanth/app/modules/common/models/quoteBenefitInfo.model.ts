import { DefaultPolicyModel } from '../services/defaultModel.service';

export class QuoteBenefitInfo {
    quoteBenefitInfo;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this.quoteBenefitInfo = this.quoteModelInstance._formBuilderInstance;
    }
    getQuoteBenefitInfoModel() {
        return this.quoteBenefitInfo.group({
            key: [''],
            benefitDesc: [''],
            premiumFAPrimeAmount: [''],
            premiumFAFormatAmount: [''],
            sumAssuredFAPrimeAmount: [''],
            sumAssuredFAFormatAmount: [''],
            premiumYearlyFAPrimeAmount: [''],
            premiumYearlyFAFormatAmount: [''],
            premiumSingleFAPrimeAmount: [''],
            premiumSingleFAFormatAmount: [''],
            benefitCode: [''],
            quoteNo: [''],
            quoteVerNo: [''],
            classification: [''],
            main_Type: [''],
            sub_Type: [''],
            lifeAssured_By: [''],
            premiumTerm: [''],
            partyDesc:[''],
            partyId: [''],
            partyRole: [''],
            benefitTerm: [''],
            benefit_Seq:[''],
            funding_Flag:['BT'],
            funding_Method:['EP']
        });
    }
}
