import { DefaultPolicyModel } from '../services/defaultModel.service';

export class PlanDetailsInfo {
    _PlanDetailsInfoForm;
    _coverageLoadingInfo;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._PlanDetailsInfoForm = this.quoteModelInstance._formBuilderInstance;
        let coverageLoadingInfo = quoteModelInstance.getCoverageLoadingInfo();
        this._coverageLoadingInfo = coverageLoadingInfo;
    }
    getPlanDetailsInfoModel() {

        return this._PlanDetailsInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            subItemNo: [''],
            subSectionNo: [''],
            covgCd: [''],
            covgDesc: [''],
            category: [''],
            deductibleCode: [''],
            deductibleDesc: [''],
            deductibleAmount: [''],
            rateText: [''],
            covgSi: [''],
            covgPrm: [''],
            oldCovgSi: [''],
            oldCovgPrm: [''],
            coverageGrpCode: [''],
            coverageGrpDesc: [''],
            ovFlag: [''],
            recalcFlag: [''],
            siCurr: [''],
            siCurrRate: [''],
            key: [''],
            remarks: [''],
            remarksDesc: [''],
            PremCurr: [''],
            PremCurrRt: [''],
            userSIValue: [''],
            isCoverageDeleted: [''],
            selfInterestPercent: [''],
            lossLimitBasisCode: [''],
            lossLimitBasisCodeDesc: [''],
            lossLimitAmountAOA: [''],
            lossLimitAmountAOY: [''],
            lossLimitAmountACT: [''],
            lossLimitAmountFLB: [''],
            unlimitedSI: [''],
            coverageLoadingInfo: this._PlanDetailsInfoForm.array([

            ]),
            coverageSubjectMatterInfo: this._PlanDetailsInfoForm.array([
            ])
        });
    }

    getAVIPlanDetailsInfoModel() {
        return this._PlanDetailsInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            covgCd: [''],
            covgDesc: [''],
            category: [''],
            rateText: [''],
            covgSi: [''],
            covgPrm: [''],
            oldCovgSi: [''],
            oldCovgPrm: [''],
            coverageGrpCode: [''],
            coverageGrpDesc: [''],
            ovFlag: [''],
            recalcFlag: [''],
            siCurr: [''],
            siCurrRate: [''],
            key: [''],
            remarks: [''],
            remarksDesc: [''],
            PremCurr: [''],
            PremCurrRt: [''],
            userSIValue: [''],
            isCoverageDeleted: [''],
            damageCode: [''],
            damageDesc: [''],
            liabilityCoverageCode: [''],
            liabilityCoverageDesc: [''],
            scheduledUnmanned: [''],
            physicalDamage: [''],
            liabilityPremiumS: [''],
            blanketCode: [''],
            blanketDesc: [''],
            aggregateLiability: [''],
            ADDAGgCode: [''],
            ADDAGgDesc: [''],
            doWarOccurrenceLiability: [''],
            triaCode: [''],
            triaDesc: [''],
            warADDAGgCode: [''],
            warADDAGgDesc: [''],
            warADDAGgDescPremium: ['0'],
            triaLiabilityPremium: ['0'],
            ADDAGgDescWAR: [''],
            triaDescWAR: [true],
            triaLiability: ['0'],
            otherDesc: ['0'],
            taxDesc: ['0'],
            grossPremium: ['0'],
            alternateDescription: ['0'],
            physicalDamagePC: [''],
            liabilityPremium: [''],
            physicalPremium: [''],
            physicalPremiumS: [''],
            liablityCoverage: [''],
            physicalCoverage: [''],
            netPremium: ['0'],
            liablityCoverageBk: [''],
            liabilityPremiumBk: [''],
            physicalCoverageBk: [''],
            physicalPremiumBk: [''],
            netPremiumBk: [''],
            covgSiDesc: [''],
            coverageLoadingInfo: this._PlanDetailsInfoForm.array([

            ])
        });
    }
}