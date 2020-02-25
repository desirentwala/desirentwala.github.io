import {DefaultPolicyModel} from '../services/defaultModel.service';

export class PlanInfo {
    _planInfoForm;
    _planDetailsInfo;
    _policyCoverageInfo;
    _summaryInfo;
    constructor(public quoteModelInstance : DefaultPolicyModel) {
        this._planInfoForm = this.quoteModelInstance._formBuilderInstance;
        let planDetailsInfo = quoteModelInstance.getPlanDetailsInfo();
        this._planDetailsInfo = planDetailsInfo;
        let policyCoverageInfo = quoteModelInstance.getPolicyCoverageInfo();
        this._policyCoverageInfo = policyCoverageInfo;
        let summaryInfo = quoteModelInstance.getSummaryInfo();
        this._summaryInfo = summaryInfo;
    }
    getPlanInfoModel() {

        return this._planInfoForm.group({
            planTypeCode: [''],
            planTypeDesc: [''],
            planSi: [''],
            planPrem: [''],
            isPlanSelected: [false],
            planDetails: this._planInfoForm.array([
                this._planDetailsInfo.getPlanDetailsInfoModel()
            ]),
            excessDeductibleCode: [''],
            excessDeductibleDesc: [''],
            key: [''],
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            policyCovgInfo: this._planInfoForm.array([

            ])
        });
    }



    getPAPlanInfoModel() {

        return this._planInfoForm.group({
            planTypeCode: [''],
            planTypeDesc: [''],
            planSi: [''],
            planPrem: [''],
            isPlanSelected: [],
            planDetails: this._planInfoForm.array([
                this._planDetailsInfo.getPlanDetailsInfoModel()
            ]),
            summaryInfo: this._summaryInfo.getPASummaryInfoModel(),
            policyCovgInfo: this._planInfoForm.array([

            ])
        });
    }

    getAVIPlanInfoModel() {
        return this._planInfoForm.group({
            planTypeCode: [''],
            planTypeDesc: ['Plan1'],
            planSi: [''],
            planPrem: [''],
            isPlanSelected: [false],
            planDetails: this._planInfoForm.array([
                this._planDetailsInfo.getAVIPlanDetailsInfoModel()
            ]),
            key: [''],
            summaryInfo: this._summaryInfo.getSummaryInfoModel(),
            policyCovgInfo: this._planInfoForm.array([

            ]),
            numberUASCode: [''],
            selectAllMakeModelInfo: [''],
            selectAllCamPayloadInfo: [''],
            selectAllSparePartInfo: [''],
            selectAllGroundEquipmentInfo: [''],
            makeModelInfo: this._planInfoForm.array([
                this.getmakeModelInfoModel(),
            ]),
            camPayloadInfo: this._planInfoForm.array([
                this.getcamPayloadInfoModel(),
            ]),
            groundEquipmentInfo: this._planInfoForm.array([
                this.getgroundEquipmentInfoModel(),
            ]),
            sparePartInfo: this._planInfoForm.array([
                this.getsparePartInfoModel(),
            ])
        });
    }

    getmakeModelInfoModel() {
        return this._planInfoForm.group({
            physicalDamage: [''],
            identificationNumber: [''],
            makeCode: [''],
            makeDesc: [''],
            modelCode: [''],
            modelDesc: [''],
            yearDesc: [''],
            yearCode: [''],
            year: [''],
            estimatedHours: [''],
            maximumWeightIncludingPayload: [''],
            physicalDamageLimit: [''],
            physicalDamagePremium: [''],
            lineholder: [''],
            nameOfLineholder: [''],
            occurrenceWarLimits: [''],
            droneModelCode: [''],
            liabilityLimitPremium: [''],
            annualHour: [''],
            addressOfLineHolder: [''],
            droneModelDesc: [''],
            liabilityLimitsCode: [''],
            liabilityLimitsDesc: [''],
            occurrenceWarLimitsCode: [''],
            occurrenceWarLimitsDesc: [''],
            nameOfLienholder: [''],
            addressOfLienholder: [''],
            pdPremium:[''],
            lbPremium:[''],
            warCode:[''],
            warDesc:[''],
        });
    }
    getcamPayloadInfoModel() {
        return this._planInfoForm.group({
            cameraOtherPayloads: [''],
            physicalDamageLimit: [''],
            value: [''],
            identificationNumber: [''],
            physicalDamage: [''],
            physicalDamagePremium: [''],
            lineholder: [''],
            addressOfLineHolder: [''],
            nameOfLineholder: [''],
            nameOfLienholder: [''],
            addressOfLienholder: [''],
            payLoadCode: [''],
            payLoadDesc: [''],
            pdPremium:['']
        });
    }
    getgroundEquipmentInfoModel() {
        return this._planInfoForm.group({
            groundEquipment: [''],
            physicalDamageLimit: [''],
            value: [''],
            identificationNumber: [''],
            physicalDamage: [''],
            physicalDamagePremium: [''],
            lineholder: [''],
            addressOfLineHolder: [''],
            nameOfLineholder: [''],
            nameOfLienholder: [''],
            addressOfLienholder: [''],
            groundEquipmentCode: [''],
            groundEquipmentDesc: [''],
            pdPremium:['']
        });
    }
    getsparePartInfoModel() {
        return this._planInfoForm.group({
            sparePart: [''],
            physicalDamageLimit: [''],
            value: [''],
            identificationNumber: [''],
            physicalDamage: [''],
            physicalDamagePremium: [''],
            lineholder: [''],
            addressOfLineHolder: [''],
            nameOfLineholder: [''],
            nameOfLienholder: [''],
            addressOfLienholder: [''],
            sparePartCode: [''],
            sparePartDesc: [''],
            pdPremium:['']
        });
    }
}
