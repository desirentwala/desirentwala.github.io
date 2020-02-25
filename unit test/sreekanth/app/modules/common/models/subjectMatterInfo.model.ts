import { DefaultPolicyModel } from '../services/defaultModel.service';

export class SubjectMatterInfo {
    _subjectMatterInfoForm;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._subjectMatterInfoForm = this.quoteModelInstance._formBuilderInstance;
    }

    getSubjectMatterInfoModel() {
        return this._subjectMatterInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            subItemNo: [''],
            subSectionNo: [''],
            seqNo: [''],
            contentTypeCode: [''],
            contentTypeDesc: [''],
            contentCode: [''],
            contentCodeDesc: [''],
            quantity: [''],
            basis: [''],
            rate: [''],
            premium: [''],
            premiumCurrencyRate: [''],
            siCurrencyRate: [''],
            premiumCurrency: [''],
            siCurrency: [''],
            siCurrencyDesc: [''],
            subjectCode: [''],
            subjectDesc: [''],
            key: [''],
            physicalDmg: [''],
            camerasPayload: [''],
            lienHolder: [''],
            physicalDamageLimit: [''],
            value: [''],
            identificationNo: [''],
            spareParts: [''],
            groundEquipments: [''],
            type: [''],
            makeCode: [''],
            makeDesc: [''],
            modelCode: [''],
            modelDesc: [''],
            year: [''],
            estimatedHours: [''],
            maximumWeight: [''],
            description1: [''],
            description2: [''],
            description3: [''],
            description4: [''],
            description5: [''],
            description6: [''],
            description7: [''],
            description8: [''],
            description9: [''],
			mandatory : [''],
            available : [''],
            default: [''],
            warranty: ['']
        });
    }

}