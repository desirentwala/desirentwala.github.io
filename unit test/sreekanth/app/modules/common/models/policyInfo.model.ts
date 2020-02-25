import { FormControl, FormGroup } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class PolicyInfo {
    _previousInsurerInfo;
    _policyInfoForm;
    _insuredInfo;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._policyInfoForm = this.quoteModelInstance._formBuilderInstance;
        let insuredInfo = quoteModelInstance.getInsuredInfo();
        this._insuredInfo = insuredInfo;
    }

    getPolicyInfoModel() {

        return this._policyInfoForm.group({
            policyTerm: [''],
            policyTermDesc: [''],
            productCd: [''],
            policyNo: [''],
            oldPolicyNo: [''],
            policySi: [''],
            policyEndtNo: [''],
            productDesc: [''],
            endtCode: [''],
            endtReasonCode: [''],
            ncpEndtReasonCode: [''],
            endtReasonCodeDesc: [''],
            agentCd: [''],
            agentName: [''],
            branchCd: [''],
            branchDesc: [''],
            quoteNo: [''],
            quoteVerNo: [''],
            quoteEndtNo: [''],
            category: [''],
            inceptionDt: [''],
            expiryDt: [''],
            issueDt: [''],
            effectiveDt: [''],
            durationInDays: [''],
            status: [''],
            statusDesc: [''],
            siCurr: [''],
            siCurrDesc: [''],
            siCurrRt: [''],
            PremCurr: [''],
            PremCurrDesc: [''],
            PremCurrRt: [''],
            isImportantNoticeEnabled: [''],
            isWarantyAndDeclarationEnabled: [''],
            isPersonalInfoStatementEnabled: [''],
            promoCode: [''],
            isB2C: [''],
            isB2B2C: [''],
            referralStatus: [''],
            referenceNo: [''],
            referenceType: [''],
            source: ['B2B'],
            ratingFlag: [true],
            isSinglePlanApplicable: [''],
            hasSinglePlan: [false],
            endtPrimaryReasonCode: [''],
            endtPrimaryReasonDesc: [''],
            searchInsurer: [''],
            isAllDeclerationsEnabled: [''],
            calculateCommissionFlag: ['N'],
            numOfBuildings: [''],
            onlineBookingFlag: [''],
            instalmentMode: [''],
            instalmentModeDesc: [''],
            noOfInstallments: [''],
            paymentDate: [''],
            paymentTime: [''],
            userNumberText4: [''],
            userNumberText5: [''],
            productVersion: [''],
            saCurrencyCd: [''],
            premiumTerm: [''],
            sumAssured: [''],
            paymentTypeCode: [''],
            paymentTypeDesc: [''],
            frequencyMode: [''],
            policyTermUnits: ['Y'],
            premiumTermUnits: ['Y'],
            premiumFormattedAmount: [''],
            premiumAmount: [''],
            isPolicyHolderAssured: [''],
            userId: [''],
            checkListID: [''],
            checkListDesc: [''],
            referralStatusDesc: [''],
            referralRemarks: [''],
            referPickedBy: [''],
            otherPartyCode5: [''],
            otherPartyCode5Desc: [''],
            binderCode: [''],
            binderCodeDesc: [''],
            lcbNcbFlag: [''],
            lcbNcbRefundType: [''],
            refundFactor1: [''],
            refundFactor2: [''],
            coInsuranceType: [''],
            ourSharePercent: [''],
            premiumHandlingFee: [''],
            coInsuranceClaim100X: [''],
            coInsurancePremium100X: [''],
            coInsuranceGrossNet: [''],
            originalSumInsured: [''],
            businessTypeCode: [''],
            businessTypeCodeDesc: [''],
            proposalDate: [''],
            isCoInsurance: [''],
            oldExpiryDt: [''],
            orAgentCode: [''],
            orAgentName: [''],
            declarationFlag: [''],
            declProvisionalSI: [''],
            declFrequency: [''],
            declBasis: [''],
            maximumTurnAroundTime: [''],
            declRemarks: [''],
            declNoOfDays: [''],
            declTempPremium: [''],
            declTempPremiumPercent: [''],
            declMinPremiumPayable: [''],
            declMinPremiumPayablePercent: [''],
            declAvgPremium: [''],
            declFinalPremium: [''],
            declTotalPremium: [''],
            declRefundPremium: ['']
        });
    }

    getTRLPolicyInfoModel() {
        return this._policyInfoForm.group({
            numberOfInsured: [''],
            policyTerm: [''],
            policyTermDesc: [''],
            productCd: [''],
            policyNo: [''],
            oldPolicyNo: [''],
            policySi: [''],
            policyEndtNo: [''],
            productDesc: [''],
            endtCode: [''],
            endtReasonCode: [''],
            ncpEndtReasonCode: [''],
            endtReasonCodeDesc: [''],
            agentCd: [''],
            agentName: [''],
            branchCd: [''],
            branchDesc: [''],
            quoteNo: [''],
            quoteVerNo: [''],
            quoteEndtNo: [''],
            category: [''],
            inceptionDt: [''],
            expiryDt: [''],
            issueDt: [''],
            effectiveDt: [''],
            durationInDays: [''],
            status: [''],
            statusDesc: [''],
            siCurr: [''],
            siCurrRt: [''],
            siCurrDesc: [''],
            PremCurr: [''],
            PremCurrDesc: [''],
            PremCurrRt: [''],
            isImportantNoticeEnabled: [''],
            isWarantyAndDeclarationEnabled: [''],
            isPersonalInfoStatementEnabled: [''],
            promoCode: [''],
            isB2C: [''],
            isB2B2C: [''],
            referralStatus: [''],
            referenceNo: [''],
            referenceType: [''],
            source: ['B2B'],
            endtPrimaryReasonCode: [''],
            endtPrimaryReasonDesc: [''],
            ratingFlag: [true],
            isSinglePlanApplicable: [''],
            hasSinglePlan: [false],
            searchInsurer: [''],
            isAllDeclerationsEnabled: [''],
            calculateCommissionFlag: ['N'],
            onlineBookingFlag: [''],
            instalmentMode: [''],
            instalmentModeDesc: [''],
            noOfInstallments: [''],
            paymentDate: [''],
            paymentTime: [''],
            userId: [''],
            checkListID: [''],
            checkListDesc: [''],
            referralStatusDesc: [''],
            referralRemarks: [''],
            referPickedBy: [''],
            binderCode: [''],
            binderCodeDesc: [''],
            lcbNcbFlag: [''],
            lcbNcbRefundType: [''],
            refundFactor1: [''],
            refundFactor2: [''],
            coInsuranceType: [''],
            ourSharePercent: [''],
            premiumHandlingFee: [''],
            coInsuranceClaim100X: [''],
            coInsurancePremium100X: [''],
            coInsuranceGrossNet: [''],
            originalSumInsured: [''],
            businessTypeCode: [''],
            businessTypeCodeDesc: [''],
            proposalDate: [''],
            isCoInsurance: [''],
            oldExpiryDt: [''],
            orAgentCode: [''],
            orAgentName: [''],
            declarationFlag: ['']
        });
    }

    getAVIPolicyInfoModel() {
        let aviPolicyInfo: FormGroup = this.getPolicyInfoModel();
        aviPolicyInfo.removeControl('numOfBuildings');
        aviPolicyInfo.removeControl('onlineBookingFlag');
        aviPolicyInfo.removeControl('userNumberText4');
        aviPolicyInfo.removeControl('userNumberText5');
        aviPolicyInfo.addControl('flyingTerritory', new FormControl());
        aviPolicyInfo.addControl('flyingTerritoryWorld', new FormControl());
        aviPolicyInfo.addControl('physicalDamageLimit', new FormControl());
        aviPolicyInfo.addControl('PolicyType', new FormControl());
        aviPolicyInfo.addControl('policyPurpose', new FormControl());
        aviPolicyInfo.addControl('policyPlan', new FormControl());
        aviPolicyInfo.addControl('policyTermHr', new FormControl());
        aviPolicyInfo.addControl('userId', new FormControl());
        aviPolicyInfo.addControl('hobbyRec', new FormControl());
        aviPolicyInfo.addControl('operateCommercialUs', new FormControl());
        aviPolicyInfo.addControl('operateCommercialCan', new FormControl());
        aviPolicyInfo.addControl('coverageType', new FormControl());
        aviPolicyInfo.addControl('addapplicantName', new FormControl());
        aviPolicyInfo.addControl('isScheduled', new FormControl());
        aviPolicyInfo.addControl('isBlanket', new FormControl());
        aviPolicyInfo.addControl('brokerCommission', new FormControl());
        aviPolicyInfo.addControl('brokerCd', new FormControl());
        aviPolicyInfo.addControl('roleId', new FormControl());
        aviPolicyInfo.addControl('startTime', new FormControl());
        aviPolicyInfo.addControl('endTime', new FormControl());
        aviPolicyInfo.addControl('noOfHours', new FormControl());
        aviPolicyInfo.addControl('cityCode', new FormControl());
        aviPolicyInfo.addControl('cityDesc', new FormControl());
        aviPolicyInfo.addControl('stateCode', new FormControl());
        aviPolicyInfo.addControl('stateDesc', new FormControl());
        aviPolicyInfo.addControl('timeZone', new FormControl());
        return aviPolicyInfo;
    }
}