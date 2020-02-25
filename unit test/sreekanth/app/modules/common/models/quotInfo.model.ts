import { DefaultPolicyModel } from '../services/defaultModel.service';

export class QuotInfo {

    _insuredInfo;
    _customerInfo;
    _policyInfo;
    _documentInfo;
    _riskInfo;
    _referQuotInfo;
    _summaryInfo;
    _paymentInfo;
    _emailQuotInfo;
    _emailPolicyDocsInfo;
    _referralHistoryInfo;
    _noteInfo;
    _filterInfo;
    _errorInfo;
    _instalmentItemInfo;
    _quoteBenefitInfo;
    _featureBenefitInfo;
    _tabInfo;
    constructor(public quoteModelInstance: DefaultPolicyModel) {

        let insuredInfo = quoteModelInstance.getInsuredInfo();
        this._insuredInfo = insuredInfo;
        let customerInfo = quoteModelInstance.getCustomerInfo();
        this._customerInfo = customerInfo;
        let policyInfo = quoteModelInstance.getPolicyInfo();
        this._policyInfo = policyInfo;
        let documentInfo = quoteModelInstance.getDocumentInfo();
        this._documentInfo = documentInfo;
        let riskInfo = quoteModelInstance.getRiskInfo();
        this._riskInfo = riskInfo;
        let referQuotInfo = quoteModelInstance.getReferQuotInfo();
        this._referQuotInfo = referQuotInfo;
        let summaryInfo = quoteModelInstance.getSummaryInfo();
        this._summaryInfo = summaryInfo;
        let paymentInfo = quoteModelInstance.getPaymentInfo();
        this._paymentInfo = paymentInfo;
        let emailQuotInfo = quoteModelInstance.getEmailQuotInfo();
        this._emailQuotInfo = emailQuotInfo;
        let referralHistoryInfo = quoteModelInstance.getReferralHistoryInfo();
        this._referralHistoryInfo = referralHistoryInfo;
        let emailPolicyDocsInfo = quoteModelInstance.getEmailPolicyDocsModel();
        this._emailPolicyDocsInfo = emailPolicyDocsInfo;
        let noteInfo = quoteModelInstance.getNoteInfoModel();
        this._noteInfo = noteInfo;
        let filterInfo = quoteModelInstance.getFilterInfoModel();
        this._filterInfo = filterInfo;
        let errorInfo = quoteModelInstance.getErrorInfo();
        this._errorInfo = errorInfo;
        let instalmentItemInfo = quoteModelInstance.getInstalmentItemInfoModel();
        this._instalmentItemInfo = instalmentItemInfo;
        let quoteBenefitInfo = quoteModelInstance.getQuoteBenefitInfo();
        this._quoteBenefitInfo = quoteBenefitInfo;
        let featureBenefitInfo = quoteModelInstance.getFeatureBenefitInfo();
        this._featureBenefitInfo = featureBenefitInfo;
        let tabInfo = quoteModelInstance.getTabInfo();
        this._tabInfo = tabInfo;
    }

    getPAQuotInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            customerInfo: this._customerInfo.getPACustomerInfoModel(),
            policyInfo: this._policyInfo.getPolicyInfoModel(),
            documentInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel(),
            ]),
            riskInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._riskInfo.getPARiskInfoModel()
            ]),
            referQuotInfo: this._referQuotInfo.getReferQuotInfoModel(),
            summaryInfo: this._summaryInfo.getPASummaryInfoModel(),
            paymentInfo: this._paymentInfo.getPaymentInfoModel(),
            emailQuotInfo: this._emailQuotInfo.getEmailQuotInfoModel(),
            referralHistoryInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._referralHistoryInfo.getReferralHistoryInfoModel(),
            ]),
            noteInfo: this._noteInfo.getNoteInfoModel(),
            filterInfo: this._filterInfo.getFilterInfoModel(),
            errorInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._errorInfo.getErrorInfo()
            ]),
            instalmentItemInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            checkListInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel()
            ])
        });
    }

    getFIRQuoteInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            customerInfo: this._customerInfo.getFIRCustomerInfoModel(),
            policyInfo: this._policyInfo.getPolicyInfoModel(),
            documentInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel(),
            ]),
            riskInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._riskInfo.getFIRRiskInfoModel()
            ]),
            referQuotInfo: this._referQuotInfo.getReferQuotInfoModel(),
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            paymentInfo: this._paymentInfo.getPaymentInfoModel(),
            emailQuotInfo: this._emailQuotInfo.getEmailQuotInfoModel(),
            referralHistoryInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._referralHistoryInfo.getReferralHistoryInfoModel(),
            ]),
            noteInfo: this._noteInfo.getNoteInfoModel(),
            filterInfo: this._filterInfo.getFilterInfoModel(),
            errorInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._errorInfo.getErrorInfo()
            ]),
            instalmentItemInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            checkListInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel()
            ]),
            coinsurerInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            nomineeInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            policyCovgInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            declarationInfo: this.quoteModelInstance._formBuilderInstance.array([
            ])
        });
    }

    getMTRQuotInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            customerInfo: this._customerInfo.getMTRCustomerModel(),
            policyInfo: this._policyInfo.getPolicyInfoModel(),
            documentInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel(),
            ]),
            riskInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._riskInfo.getMTRRiskInfoModel(),
            ]),
            emailQuotInfo: this._emailQuotInfo.getEmailQuotInfoModel(),
            emailPolicyDocsInfo: this._emailPolicyDocsInfo.getEmailPolicyDocsModel(),
            referQuotInfo: this._referQuotInfo.getReferQuotInfoModel(),
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            paymentInfo: this._paymentInfo.getPaymentInfoModel(),
            noteInfo: this._noteInfo.getNoteInfoModel(),
            filterInfo: this._filterInfo.getFilterInfoModel(),
            errorInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._errorInfo.getErrorInfo()
            ]),
            instalmentItemInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            checkListInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel()
            ])
        });
    }

    getTRLQuotInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            customerInfo: this._customerInfo.getCustomerInfoModel(),
            policyInfo: this._policyInfo.getTRLPolicyInfoModel(),
            documentInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel(),
            ]),
            riskInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._riskInfo.getTRLRiskInfoInfoModel()
            ]),
            referQuotInfo: this._referQuotInfo.getReferQuotInfoModel(),
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            paymentInfo: this._paymentInfo.getPaymentInfoModel(),
            emailQuotInfo: this._emailQuotInfo.getEmailQuotInfoModel(),
            emailPolicyDocsInfo: this._emailPolicyDocsInfo.getEmailPolicyDocsModel(),
            referralHistoryInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._referralHistoryInfo.getReferralHistoryInfoModel(),
            ]),
            noteInfo: this._noteInfo.getNoteInfoModel(),
            filterInfo: this._filterInfo.getFilterInfoModel(),
            errorInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._errorInfo.getErrorInfo()
            ]),
            instalmentItemInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            checkListInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel()
            ])

        });
    }

    getLIFQuotInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            customerInfo: this._customerInfo.getLIFCustomerInfoModel(),
            policyInfo: this._policyInfo.getPolicyInfoModel(),
            documentInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel(),
            ]),
            riskInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._riskInfo.getLIFRiskInfoInfoModel()
            ]),
            referQuotInfo: this._referQuotInfo.getReferQuotInfoModel(),
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            paymentInfo: this._paymentInfo.getPaymentInfoModel(),
            emailQuotInfo: this._emailQuotInfo.getEmailQuotInfoModel(),
            emailPolicyDocsInfo: this._emailPolicyDocsInfo.getEmailPolicyDocsModel(),
            referralHistoryInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._referralHistoryInfo.getReferralHistoryInfoModel(),
            ]),
            noteInfo: this._noteInfo.getNoteInfoModel(),
            filterInfo: this._filterInfo.getFilterInfoModel(),
            errorInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._errorInfo.getErrorInfo()
            ]),
            beneficiaryInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._customerInfo.getLIFCustomerInfoModel()]),
            beneficiary: this._customerInfo.getLIFCustomerInfoModel(),
            quotBenifitList: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            featureBenefitList: this.quoteModelInstance._formBuilderInstance.array([
                this._featureBenefitInfo.getFeatureBenefitInfoModel()]),
            checkListInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel()
            ])
        });
    }

    getAVIQuotInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            customerInfo: this._customerInfo.getAviCustomerInfoModel(),
            policyInfo: this._policyInfo.getAVIPolicyInfoModel(),
            documentInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel(),
            ]),
            riskInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._riskInfo.getAVIRiskInfoInfoModel()
            ]),
            referQuotInfo: this._referQuotInfo.getReferQuotInfoModel(),
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            paymentInfo: this._paymentInfo.getPaymentInfoModel(),
            emailQuotInfo: this._emailQuotInfo.getEmailQuotInfoModel(),
            emailPolicyDocsInfo: this._emailPolicyDocsInfo.getEmailPolicyDocsModel(),
            referralHistoryInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._referralHistoryInfo.getReferralHistoryInfoModel(),
            ]),
            checkListInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel()
            ]),
            tabInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._tabInfo.getTabInfoModel()
            ])
        });
    }

    getMARQuoteInfoModel() {
        return this.quoteModelInstance._formBuilderInstance.group({
            customerInfo: this._customerInfo.getCustomerInfoModel(),
            policyInfo: this._policyInfo.getPolicyInfoModel(),
            documentInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel(),
            ]),
            riskInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._riskInfo.getMARRiskInfoModel()
            ]),
            referQuotInfo: this._referQuotInfo.getReferQuotInfoModel(),
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            paymentInfo: this._paymentInfo.getPaymentInfoModel(),
            emailQuotInfo: this._emailQuotInfo.getEmailQuotInfoModel(),
            referralHistoryInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._referralHistoryInfo.getReferralHistoryInfoModel(),
            ]),
            noteInfo: this._noteInfo.getNoteInfoModel(),
            filterInfo: this._filterInfo.getFilterInfoModel(),
            errorInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._errorInfo.getErrorInfo()
            ]),
            instalmentItemInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            checkListInfo: this.quoteModelInstance._formBuilderInstance.array([
                this._documentInfo.getDocumentInfoModel()
            ]),
            coinsurerInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            nomineeInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            policyCovgInfo: this.quoteModelInstance._formBuilderInstance.array([
            ]),
            declarationInfo: this.quoteModelInstance._formBuilderInstance.array([
            ])
        });
    }
}
