import { DefaultPolicyModel } from '../services/defaultModel.service';
import { FormBuilder } from '@angular/forms';

export class FeatureBenefitInfo {
    featureBenefitForm: FormBuilder;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this.featureBenefitForm = this.defaultModelService._formBuilderInstance;
    }
    getFeatureBenefitInfoModel() {
        return this.featureBenefitForm.group({
            benefitDesc: [''],
            benefitCode: [''],
            quoteNo: [''],
            quotVersion: [''],
            classification: [''],
            main_Type: [''],
            sub_Type: [''],
            lifeAssured_By: [''],
            premiumTerm: [''],
            partyDesc: [''],
            partyId: [''],
            partyRole: [''],
            benefitTerm: [''],
            premiumFAPrimeAmount: [''],
            premiumFAFormatAmount: [''],
            sumAssuredFAPrimeAmount: [''],
            sumAssuredFAFormatAmount: [''],
            premiumYearlyFAPrimeAmount: [''],
            premiumYearlyFAFormatAmount: [''],
            premiumSingleFAPrimeAmount: [''],
            premiumSingleFAFormatAmount: [''],
            benefit_Seq:[''],
            funding_Flag:['BT'],
            funding_Method:['EP'],
            key:['']
        });
    }
}