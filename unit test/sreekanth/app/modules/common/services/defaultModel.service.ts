import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { IModel } from '../../../core/services/iModel.service';
import {
    AddressInfo,
    CampaignInfo,
    CardInfo,
    ClaimHistoryInfo,
    CoverageLoadingInfo,
    CustomerInfo,
    CustomerPersonalDetails,
    DocumentInfo,
    EmailPolicyDocs,
    EmailQuotInfo,
    InsuredInfo,
    NomineeInfo,
    PaymentEnquiryInfoModel,
    PaymentInfo,
    PlanDetailsInfo,
    PlanInfo,
    PolicyCoverageInfo,
    PolicyInfo,
    QuoteEnquiryInfo,
    QuotInfo,
    ReferQuotInfo,
    ReferralHistoryInfo,
    RiskInfo,
    SubjectMatterInfo,
    SummaryInfo,
    NoteInfo,
    TravelInfo,
    FilterInfo,
    ErrorInfo,
    InstalmentItemInfo,
    RidersInfo,
    PreviousInsurerInfo,
    AviationUsageInfo,
    AviationPilotInfo,
    QuoteBenefitInfo,
    FeatureBenefitInfo,
    RuleInfo,
    AdditionalInsurerInfo,
    TabInfo,
    PilotInfo,
	CoinsurerInfo,
	DeclarationInfo,
	DeclarationItemSectionInfo,
	DeclarationCoverageInfo,
	RiskSurveyorDetailsInfo,
	AdditionalRiskInfo
} from '../models';
import { UasOperatingInfo } from '../models/uasOperatingInfo.model';




/**
 * This class provides the Models for Policy / Quote and Claim.
 */
@Injectable()
export class DefaultPolicyModel implements IModel {
    constructor(public _formBuilderInstance: FormBuilder) { }
    public getAddressInfo() {
        return new AddressInfo();
    }
    public getCustomerInfo() {
        return new CustomerInfo(this);
    }
    public getDocumentInfo() {
        return new DocumentInfo(this);
    }
    public getPaymentInfo() {
        return new PaymentInfo(this);
    }
    public getInsuredInfo() {
        return new InsuredInfo(this);
    }
    public getPlanDetailsInfo() {
        return new PlanDetailsInfo(this);
    }
    public getPlanInfo() {
        return new PlanInfo(this);
    }
    public getPolicyInfo() {
        return new PolicyInfo(this);
    }

    public getPolicyCoverageInfo() {
        return new PolicyCoverageInfo(this);
    }
    public getQuotInfo() {
        return new QuotInfo(this);
    }
    public getReferQuotInfo() {
        return new ReferQuotInfo(this);
    }
    public getRiskInfo() {
        return new RiskInfo(this);
    }
    public getSummaryInfo() {
        return new SummaryInfo(this);
    }
    public getQuoteEnquiryInfo() {
        return new QuoteEnquiryInfo(this);
    }
    public getCustomerPersonalDetailsInfo() {
        return new CustomerPersonalDetails(this);
    }
    public getEmailQuotInfo() {
        return new EmailQuotInfo(this);
    }
    public getReferralHistoryInfo() {
        return new ReferralHistoryInfo(this);
    }
    public getEmailPolicyDocsModel() {
        return new EmailPolicyDocs(this);
    }

    public getNomineeModel() {
        return new NomineeInfo(this);
    }
    public getCampaignModel() {
        return new CampaignInfo(this);
    }
    public getEnquiryPaymentModel() {
        return new PaymentEnquiryInfoModel(this);
    }
    public getCardInfo() {
        return new CardInfo(this);
    }
    public getSubjectMatterInfo() {
        return new SubjectMatterInfo(this);
    }
    public getClaimHistoryInfo() {
        return new ClaimHistoryInfo(this);
    }
    public getCoverageLoadingInfo() {
        return new CoverageLoadingInfo(this);
    }
    public getNoteInfoModel() {
        return new NoteInfo(this);
    }
    public getTravelInfoModel() {
        return new TravelInfo(this);
    }
    public getFilterInfoModel() {
        return new FilterInfo(this);
    }
    public getErrorInfo() {
        return new ErrorInfo(this);
    }
    public getInstalmentItemInfoModel() {
        return new InstalmentItemInfo(this);
    }
    public getRidersInfo() {
        return new RidersInfo(this);
    }
    public getPreviousInsurerInfomodel() {
        return new PreviousInsurerInfo(this);
    }
    public getAviationPilotInfo() {
        return new AviationPilotInfo(this);
    }
    public getAviationUsageInfo() {
        return new AviationUsageInfo(this);
    }
    public getQuoteBenefitInfo() {
        return new QuoteBenefitInfo(this);
    }
    public getFeatureBenefitInfo() {
        return new FeatureBenefitInfo(this);
    }
    public getAdditionalInsurerInfomodel() {
        return new AdditionalInsurerInfo(this);
    }
    public getUasOperatingInfoModel() {
        return new UasOperatingInfo(this);
    }
    public getTabInfo() {
        return new TabInfo(this);
    }
    public getPilotInfo() {
        return new PilotInfo(this);
    }
    public getCoinsurerInfo() {
        return new CoinsurerInfo(this);
    }
    public getDeclarationInfo() {
        return new DeclarationInfo(this);
    }
    public getDeclarationItemSectionInfo() {
        return new DeclarationItemSectionInfo(this);
    }
    public getDeclarationCoverageInfo() {
        return new DeclarationCoverageInfo(this);
    }
    public getRiskSurveyorDetailsInfo() {
        return new RiskSurveyorDetailsInfo(this);
    }
    public getAdditionalRiskInfo() {
        return new AdditionalRiskInfo(this);
    }
}
