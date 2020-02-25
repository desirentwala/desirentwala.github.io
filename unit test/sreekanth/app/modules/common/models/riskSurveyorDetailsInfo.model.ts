import { DefaultPolicyModel } from '../services/defaultModel.service';

export class RiskSurveyorDetailsInfo {
    _riskSurveyorDetailsInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._riskSurveyorDetailsInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getRiskSurveyorDetailsInfoModel() {
        return this._riskSurveyorDetailsInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            surveyorCode: [''],
            surveyorCodeDesc: [''],
            surveyorTypeCode: [''],
            surveyorTypeCodeDesc: [''],
            surveyorDetail: [''],
            surveyorFees: [''],
            surveyReportNo: [''],
            key: ['']
        });
    }

}