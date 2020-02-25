import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class RiskInfo {

    _riskInfoForm;
    _planInfo;
    _insuredInfo;
    nomineeInfo;
    _subjectMatterInfo;
    _claimHistoryInfo;
    _travelInfo;
    _ridersInfo;
    _pilotInfo;
    _aviationUsageInfo;
    _pilotriskInfo;
    _aviationRiskInfo;

    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._riskInfoForm = this.quoteModelInstance._formBuilderInstance;
        let planInfo = quoteModelInstance.getPlanInfo();
        this._planInfo = planInfo;
        let insuredInfo = quoteModelInstance.getInsuredInfo();
        this._insuredInfo = insuredInfo;
        this.nomineeInfo = this.quoteModelInstance.getNomineeModel();
        let subjectMatterInfo = this.quoteModelInstance.getSubjectMatterInfo();
        this._subjectMatterInfo = subjectMatterInfo;
        let claimHistoryInfo = this.quoteModelInstance.getClaimHistoryInfo();
        this._claimHistoryInfo = claimHistoryInfo;
        let travelInfo = quoteModelInstance.getTravelInfoModel();
        this._travelInfo = travelInfo;
        let ridersInfo = quoteModelInstance.getRidersInfo();
        this._ridersInfo = ridersInfo;
        let aviationPilotInfo = quoteModelInstance.getPilotInfo();
        this._pilotInfo = aviationPilotInfo;

    }

    getMTRRiskInfoModel() {
        let riskInfoForm: FormGroup = this.getRiskInfoModel();
        riskInfoForm.addControl('vehicleMakeCode', new FormControl(''));
        riskInfoForm.addControl('vehicleMakeDesc', new FormControl(''));
        riskInfoForm.addControl('vehicleModelCode', new FormControl(''));
        riskInfoForm.addControl('vehicleModelDesc', new FormControl(''));
        riskInfoForm.addControl('vehicleTypeCode', new FormControl(''));
        riskInfoForm.addControl('vehicleTypeDesc', new FormControl(''));
        riskInfoForm.addControl('vehicleManufacturingYear', new FormControl(''));
        riskInfoForm.addControl('vehicleAge', new FormControl(0));
        riskInfoForm.addControl('hasVehicleModified', new FormControl(''));
        riskInfoForm.addControl('hasDriverClaimed', new FormControl(''));
        riskInfoForm.addControl('vehicleModDesc', new FormControl(''));
        riskInfoForm.addControl('vehicleBodyType', new FormControl(''));
        riskInfoForm.addControl('vehicleCubicCapacity', new FormControl(''));
        riskInfoForm.addControl('vehicleSeatingCapacity', new FormControl(''));
        riskInfoForm.addControl('vehicleEngineNo', new FormControl(''));
        riskInfoForm.addControl('vehicleChassisNo', new FormControl(''));
        riskInfoForm.addControl('vehicleRegNo', new FormControl(''));
        riskInfoForm.addControl('vehicleUsageCode', new FormControl(''));
        riskInfoForm.addControl('vehicleUsageDesc', new FormControl(''));
        riskInfoForm.addControl('ncdCode', new FormControl(''));
        riskInfoForm.addControl('ncdDesc', new FormControl(''));
        riskInfoForm.addControl('ncdEligibility', new FormControl(''));
        riskInfoForm.addControl('coverCodeDesc', new FormControl(''));
        riskInfoForm.addControl('CodecoverCodeCd', new FormControl(''));
        riskInfoForm.addControl('finalExcess', new FormControl(''));
        riskInfoForm.addControl('hasNCDProtection', new FormControl(''));
        riskInfoForm.addControl('excessLevelCode', new FormControl(''));
        riskInfoForm.addControl('excessLevelDesc', new FormControl(''));
        riskInfoForm.addControl('hasAdditionalDrivers', new FormControl(''));
        riskInfoForm.addControl('isVehicleHypothecated', new FormControl(''));
        riskInfoForm.addControl('hypothecatedCompanyName', new FormControl(''));
        riskInfoForm.addControl('isHirePurchaseApp', new FormControl(''));
        riskInfoForm.addControl('hirePurchaseCompName', new FormControl(''));
        riskInfoForm.addControl('isPolicyHolderInsured', new FormControl(''));
        riskInfoForm.addControl('displayPlanTypeDesc', new FormControl(''));
        riskInfoForm.addControl('displayPlanTypeCode', new FormControl(''));
        riskInfoForm.addControl('usageCode', new FormControl(''));
        riskInfoForm.addControl('usageDesc', new FormControl(''));
        riskInfoForm.addControl('isSafeDriver', new FormControl(''));
        riskInfoForm.addControl('itemStatus', new FormControl(''));
        riskInfoForm.addControl('displayCoverageCode', new FormControl(''));
        riskInfoForm.addControl('displayCoverageDesc', new FormControl(''));
        riskInfoForm.addControl('isLienApprovalRequiredForCancellation', new FormControl(''));
        riskInfoForm.addControl('vehicleSchemeTypeCode', new FormControl(''));
        riskInfoForm.addControl('vehicleSchemeTypeCodeDesc', new FormControl(''));
        riskInfoForm.addControl('vehicleVariantCode', new FormControl(''));
        riskInfoForm.addControl('vehicleVariantCodeDesc', new FormControl(''));
        riskInfoForm.addControl('numberOfAirbags', new FormControl(''));
        riskInfoForm.addControl('hasLDW', new FormControl(''));
        riskInfoForm.addControl('hasFCW', new FormControl(''));
        riskInfoForm.addControl('hasESP', new FormControl(''));
        riskInfoForm.addControl('hasABS', new FormControl(''));
        riskInfoForm.addControl('hasCBS', new FormControl(''));
        riskInfoForm.addControl('hasEBA', new FormControl(''));
        riskInfoForm.addControl('hasTCS', new FormControl(''));
        riskInfoForm.addControl('hasASC', new FormControl(''));
        riskInfoForm.addControl('vehicleTransmissionTypeCode', new FormControl(''));
        riskInfoForm.addControl('vehicleTransmissionTypeCodeDesc', new FormControl(''));
        riskInfoForm.addControl('youngestDriverAge', new FormControl(''));
        riskInfoForm.addControl('youngestDriverExperience', new FormControl(''));
        riskInfoForm.addControl('youngestDriverGender', new FormControl(''));
        riskInfoForm.addControl('interestCode', new FormControl(''));
        riskInfoForm.addControl('interestDesc', new FormControl(''));
        riskInfoForm.addControl('vehicleFuelTypeCode', new FormControl(''));
        riskInfoForm.addControl('vehicleFuelTypeDesc', new FormControl(''));
        riskInfoForm.addControl('vehiclePassengerCapacity', new FormControl(''));
        riskInfoForm.addControl('vehicleWeight', new FormControl(''));
        riskInfoForm.addControl('vehicleHorsepower', new FormControl(''));
        riskInfoForm.addControl('isVehicleOwnerNew', new FormControl(''));
        riskInfoForm.addControl('isInsuredSameAsMainDriver', new FormControl(''));
        riskInfoForm.addControl('isYoungestDriverSameAsMainDriver', new FormControl(''));
        riskInfoForm.addControl('itemSelected', new FormControl('N'));
        riskInfoForm.addControl('itemPlanSelectedCode', new FormControl(''));
        riskInfoForm.addControl('itemPlanSelectedDesc', new FormControl(''));
        riskInfoForm.addControl('additionalBoolean1', new FormControl(''));
        riskInfoForm.addControl('plans', new FormArray([
            this._planInfo.getPlanInfoModel()
        ]));
        riskInfoForm.addControl('insuredList', new FormArray([
            this._insuredInfo.getMotorInsuredInfoModel()
        ]));
        riskInfoForm.addControl('driverClaimsHistory', new FormArray([
            this._riskInfoForm.group({
                claimAmount: [''],
                claimCount: [''],
                claimCurrency: [''],
                claimCurrencyDesc: [''],
            })
        ]));
        return riskInfoForm;
    }

    getPARiskInfoModel() {
        let riskInfoForm: FormGroup = this.getRiskInfoModel();
        riskInfoForm.addControl('occupationClassCode', new FormControl(''));
        riskInfoForm.addControl('occupationClassDesc', new FormControl(''));
        riskInfoForm.addControl('DOB', new FormControl(''));
        riskInfoForm.addControl('age', new FormControl(''));
        riskInfoForm.addControl('appCode', new FormControl(''));
        riskInfoForm.addControl('policyHolderType', new FormControl(''));
        riskInfoForm.addControl('appFullName', new FormControl(''));
        riskInfoForm.addControl('appFName', new FormControl(''));
        riskInfoForm.addControl('appMName', new FormControl(''));
        riskInfoForm.addControl('appLName', new FormControl(''));
        riskInfoForm.addControl('genderCode', new FormControl(''));
        riskInfoForm.addControl('identityTypeCode', new FormControl(''));
        riskInfoForm.addControl('identityTypeDesc', new FormControl(''));
        riskInfoForm.addControl('identityNo', new FormControl(''));
        riskInfoForm.addControl('relationshipToInsuredCode', new FormControl(''));
        riskInfoForm.addControl('relationshipToInsuredDesc', new FormControl(''));
        riskInfoForm.addControl('relationWithAppCode', new FormControl(''));
        riskInfoForm.addControl('relationWithAppDesc', new FormControl(''));
        riskInfoForm.addControl('beneficiaryName', new FormControl(''));
        riskInfoForm.addControl('beneficiaryAge', new FormControl(''));
        riskInfoForm.addControl('beneficiaryGenderCode', new FormControl(''));
        riskInfoForm.addControl('emailId', new FormControl(''));
        riskInfoForm.addControl('mobilePh', new FormControl(''));
        riskInfoForm.addControl('appUnitNumber', new FormControl(''));
        riskInfoForm.addControl('hasSpouse', new FormControl(''));
        riskInfoForm.addControl('numberofChildren', new FormControl(''));
        riskInfoForm.addControl('excessDeductibleCode', new FormControl(''));
        riskInfoForm.addControl('excessDeductibleDesc', new FormControl(''));
        riskInfoForm.addControl('isItemAdded', new FormControl(false));
        riskInfoForm.addControl('isItemDeleted', new FormControl(false));
        riskInfoForm.addControl('homePh', new FormControl(''));
        riskInfoForm.addControl('status', new FormControl(''));
        riskInfoForm.addControl('displayCoverageCode', new FormControl(''));
        riskInfoForm.addControl('displayCoverageDesc', new FormControl(''));
        riskInfoForm.addControl('isLienApprovalRequiredForCancellation', new FormControl(''));
        riskInfoForm.addControl('itemSelected', new FormControl('N'));
        riskInfoForm.addControl('itemPlanSelectedCode', new FormControl(''));
        riskInfoForm.addControl('itemPlanSelectedDesc', new FormControl(''));
        riskInfoForm.addControl('plans', new FormArray([
            this._planInfo.getPAPlanInfoModel()
        ]));
        riskInfoForm.addControl('nomineeList', new FormArray([
            this.nomineeInfo.getNomineeInfo()
        ]));
        riskInfoForm.addControl('externalIDs', new FormArray([
            this.getExternalIDModel()
        ]));
        return riskInfoForm;
    }

    getFIRRiskInfoModel() {
        let riskInfoForm: FormGroup = this.getRiskInfoModel();
        riskInfoForm.addControl('occupationCode', new FormControl(''));
        riskInfoForm.addControl('occupationDesc', new FormControl(''));
        riskInfoForm.addControl('buildingTypeCode', new FormControl(''));
        riskInfoForm.addControl('buildingTypeDesc', new FormControl(''));
        riskInfoForm.addControl('ownershipCode', new FormControl(''));
        riskInfoForm.addControl('ownershipDesc', new FormControl(''));
        riskInfoForm.addControl('geoCode', new FormControl(''));
        riskInfoForm.addControl('riskBlockCode', new FormControl(''));
        riskInfoForm.addControl('riskBlockDesc', new FormControl(''));
        riskInfoForm.addControl('riskCategoryCode', new FormControl(''));
        riskInfoForm.addControl('riskCategoryDesc', new FormControl(''));
        riskInfoForm.addControl('noOfFloors', new FormControl(''));
        riskInfoForm.addControl('buildingArea', new FormControl(''));
        riskInfoForm.addControl('noOfResidents', new FormControl(''));
        riskInfoForm.addControl('itemStatus', new FormControl(''));
        riskInfoForm.addControl('isItemAdded', new FormControl(false));
        riskInfoForm.addControl('isItemDeleted', new FormControl(false));
        riskInfoForm.addControl('displayPlanTypeDesc', new FormControl(''));
        riskInfoForm.addControl('displayPlanTypeCode', new FormControl(''));
        riskInfoForm.addControl('numberofRooms', new FormControl(''));
        riskInfoForm.addControl('floor', new FormControl(''));
        riskInfoForm.addControl('outofFloor', new FormControl(''));
        riskInfoForm.addControl('zipCd', new FormControl(''));
        riskInfoForm.addControl('zipCdDesc', new FormControl(''));
        riskInfoForm.addControl('cityCode', new FormControl(''));
        riskInfoForm.addControl('cityDesc', new FormControl(''));
        riskInfoForm.addControl('interestCode', new FormControl(''));
        riskInfoForm.addControl('interestDesc', new FormControl(''));
        riskInfoForm.addControl('apartmentLevel', new FormControl(''));
        riskInfoForm.addControl('apartmentLevelDesc', new FormControl(''));
        riskInfoForm.addControl('propertyClassCode', new FormControl(''));
        riskInfoForm.addControl('propertyClassDesc', new FormControl(''));
        riskInfoForm.addControl('constructionMaterialTypeCode', new FormControl(''));
        riskInfoForm.addControl('constructionMaterialTypeDesc', new FormControl(''));
        riskInfoForm.addControl('hasInsuranceCompanyDeclined', new FormControl(''));
        riskInfoForm.addControl('areaCode', new FormControl(''));
        riskInfoForm.addControl('areaCodeDesc', new FormControl(''));
        riskInfoForm.addControl('blockNumber', new FormControl(''));
        riskInfoForm.addControl('appUnitNumber', new FormControl(''));
        riskInfoForm.addControl('address1', new FormControl(''));
        riskInfoForm.addControl('isLienApprovalRequiredForCancellation', new FormControl(''));
        riskInfoForm.addControl('buildingAge', new FormControl(''));
        riskInfoForm.addControl('buildingAgeDesc', new FormControl(''));
        riskInfoForm.addControl('isPropertyAndInsuredAddressSame', new FormControl(''));
        riskInfoForm.addControl('displayCoverageCode', new FormControl(''));
        riskInfoForm.addControl('displayCoverageDesc', new FormControl(''));
        riskInfoForm.addControl('itemSelected', new FormControl('N'));
        riskInfoForm.addControl('itemPlanSelectedCode', new FormControl(''));
        riskInfoForm.addControl('itemPlanSelectedDesc', new FormControl(''));
        riskInfoForm.addControl('apartmentNumber', new FormControl(''));
        riskInfoForm.addControl('state', new FormControl(''));
        riskInfoForm.addControl('stateDesc', new FormControl(''));
        riskInfoForm.addControl('address2', new FormControl(''));
        riskInfoForm.addControl('longitude', new FormControl(''));
        riskInfoForm.addControl('latitude', new FormControl(''));
        riskInfoForm.addControl('earthQuakeZone', new FormControl(''));
        riskInfoForm.addControl('stormZone', new FormControl(''));
        riskInfoForm.addControl('floodZone', new FormControl(''));
        riskInfoForm.addControl('tradeFreeZoneCode', new FormControl(''));
        riskInfoForm.addControl('tradeFreeZoneCodeDesc', new FormControl(''));
        riskInfoForm.addControl('zoneCode', new FormControl(''));
        riskInfoForm.addControl('zoneCodeDesc', new FormControl(''));
        riskInfoForm.addControl('safetyLevelCode', new FormControl(''));
        riskInfoForm.addControl('safetyLevelCodeDesc', new FormControl(''));
        riskInfoForm.addControl('lossLimitBasisCode', new FormControl(''));
        riskInfoForm.addControl('lossLimitBasisCodeDesc', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountAOA', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountAOY', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountACT', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountFLB', new FormControl(''));
        riskInfoForm.addControl('riskLocation1', new FormControl(''));
        riskInfoForm.addControl('riskLocation5', new FormControl(''));
        riskInfoForm.addControl('constructionRoof', new FormControl(''));
        riskInfoForm.addControl('sectClDesc', new FormControl(''));
        riskInfoForm.addControl('subItemNo', new FormControl(''));
        riskInfoForm.addControl('subSectionNo', new FormControl(''));
        riskInfoForm.addControl('isRiskSegregated', new FormControl(''));
        riskInfoForm.addControl('countryCode', new FormControl(''));
        riskInfoForm.addControl('countryDesc', new FormControl(''));
        riskInfoForm.addControl('lossLimitDays', new FormControl(''));
        riskInfoForm.addControl('lossLimitPerDay', new FormControl(''));
        riskInfoForm.addControl('tempHousingMonths', new FormControl(''));
        riskInfoForm.addControl('tempHousingPerMonth', new FormControl(''));
        riskInfoForm.addControl('deathOrDisablityPersons', new FormControl(''));
        riskInfoForm.addControl('deathOrDisablityPerPerson', new FormControl(''));
        riskInfoForm.addControl('medicalPersons', new FormControl(''));
        riskInfoForm.addControl('medicalPerPerson', new FormControl(''));
        riskInfoForm.addControl('stockMaterial', new FormControl(''));
        riskInfoForm.addControl('stockMaterialDesc', new FormControl(''));
        riskInfoForm.addControl('plans', new FormArray([
            this._planInfo.getPlanInfoModel()
        ]));
        riskInfoForm.addControl('subRiskInfo', new FormArray([]));
        riskInfoForm.addControl('riskSurveyorDetailsInfo', new FormArray([]));
        return riskInfoForm;
    }

    getTRLRiskInfoInfoModel() {
        return this._riskInfoForm.group({
            regionCode: [''],
            regionDesc: [''],
            travellerTypeCode: [''],
            travellerTypeDesc: [''],
            numberofAdults: [''],
            numberofChildren: [''],
            numberofTravellers: [''],
            numOfInsured: [''],
            travellingTo: [''],
            travelToCode: [''],
            travelToDesc: [''],
            isInsuredDetailAvail: [''],
            itemNo: [''],
            itemPrm: [''],
            itemSi: [''],
            key: [''],
            sectCl: [''],
            sectNo: [''],
            occupationClassCode: [''],
            occupationClassDesc: [''],
            designationCode: [''],
            designationDesc: [''],
            isItemAdded: [false],
            isItemDeleted: [false],
            status: [''],
            itemStatus: [''],
            isHomeUnderLien: [''],
            mortgagePartyCode: [''],
            mortgagePartyDesc: [''],
            mortgageExternalRefNumber: [''],
            mortgageTypeCode: [''],
            mortgageTypeCodeDesc: [''],
            mortgageNoticeDays: [''],
            mortgageExpiryDate: [''],
            isLienApprovalRequiredForCancellation: [''],
            displayCoverageCode: [''],
            displayCoverageDesc: [''],
            itemSelected: ['N'],
            itemPlanSelectedCode: [''],
            itemPlanSelectedDesc: [''],
            classScreenCode: [''],
            plans: this._riskInfoForm.array([
                this._planInfo.getPlanInfoModel(),
            ]),
            insuredList: this._riskInfoForm.array([
                this._insuredInfo.getInsuredInfoModel(),
            ]),
            countryTravelList: this._riskInfoForm.array([
                this._travelInfo.getTravelInfoModel(),
            ])
        });
    }

    getLIFRiskInfoInfoModel() {
        return this._riskInfoForm.group({
            ridersList: [''],
            key: [''],
            itemSi: [''],
            itemNo: [''],
            sectNo: [''],
            sectCl: [''],
            itemPrm: [''],
            occupationClassCode: [''],
            occupationClassDesc: [''],
            riderSA: [''],
            riderCode: [''],
            riderDesc: [''],
            riderPolicyTerm: [''],
            ridersKey: [''],
            ridersInfo: this._riskInfoForm.array([
                this._ridersInfo.getRiderInfoModel()
            ]),
            insuredList: this._riskInfoForm.array([
                this._insuredInfo.getLifeInsuredInfoModel(),
            ]),
            plans: this._riskInfoForm.array([
                this._planInfo.getPlanInfoModel(),
            ]),
        });
    }

    getAVIRiskInfoInfoModel() {
        return this._riskInfoForm.group({
            itemNo: [''],
            key: [''],
            sectCl: [''],
            sectNo: [''],
            isItemAdded: [false],
            isItemDeleted: [false],
            itemStatus: [''],
            exposureHoursCode: [''],
            exposureHoursDesc: [''],
            isOprMultipleUAS: [''],
            isMultipleUAS: [''],
            isUASExt: [''],
            isOprOutside: [''],
            operationOne: [''],
            operationTwo: [''],
            operationThree: [''],
            operationFour: [''],
            purposeOfUse: [''],
            purposeOfUseCode: [''],
            purposeOfUseDesc: [''],
            missionProfile: [''],
            missionProfileCode: [''],
            missionProfileDesc: [''],
            pilotAirmanCertificate: [''],
            approvedPilots: [''],
            approvedPilotsCode: [''],
            approvedPilotsDesc: [''],
            planToFlyCanadaId: [''],
            overCrowds: [''],
            isInsuranceClaimed: [''],
            insuranceClaimDesc: [''],
            isInsurerCancelled: [''],
            insurerCancelDesc: [''],
            claimedCount: [''],
            isExistInsurance: [''],
            claimTypeCode: [''],
            claimTypeCodeDesc: [''],
            scheduledUnmanned: [''],
            blanketCode: [''],
            blanketDesc: [''],
            aggregateLiability: [''],
            aggregateLiabilitySCH: [''],
            doWarOccurrenceLiabilitySCH: [''],
            aggregateLiabilityBLK: [''],
            doWarOccurrenceLiabilityBLK: [''],
            ADDAGgCode: [''],
            ADDAGgDesc: ['0'],
            triaCode: [''],
            triaDesc: ['0'],
            documentContent: [''],
            operations: [''],
            isUASRacingPurpose: [''],
            doWarOccurrenceLiability: [''],
            uasLocalState: [''],
            faaRegistrationConfirm: [''],
            isMGTOWGreater: [''],
            procedures: [''],
            planToFly: [''],
            sectionOne: [''],
            sectionTwo: [''],
            sectionThree: [''],
            sectionFour: [''],
            sectionFive: [''],
            sectionSix: [''],
            sectionSeven: [''],
            sectionEight: [''],
            sectionNine: [''],
            sectionTen: [''],
            sectionEleven: [''],
            sectionTwelve: [''],
            doesTheOperatorComply: [''],
            movingVehicleOrAircraft: [''],
            nightTimeOperations: [''],
            beyondVisualSight: [''],
            visualObserver: [''],
            pilotOperating: [''],
            operationsOverPeople: [''],
            operationsInAirspace: [''],
            operationsAtGroundSpeed: [''],
            operatingAtAltitude: [''],
            operatingWithLessThanTwo: [''],
            medicalCode: [''],
            medicalDesc: [''],
            coverType: [''],
            subCoverType: [''],
            deductible: [''],
            lienHolderMakeModalSelectAll: [''],
            lienHolderCamPayloadSelectAll: [''],
            lienHolderSparepartsSelectAll: [''],
            lienHolderGroundsSelectAll: [''],
            operationsmultipleUAS: [''],
            multipleUasFlying:[''],
            plans: this._riskInfoForm.array([
                this._planInfo.getAVIPlanInfoModel(),
            ]),
            pilotInfo: this._riskInfoForm.array([
                this._pilotInfo.getPilotInfo()
            ]),
            attachments: this._riskInfoForm.array([
                this.getfileuploadModel(),
            ]),
            subjectMatterInfo: this._riskInfoForm.array([
                this._subjectMatterInfo.getSubjectMatterInfoModel()
            ]),
            fileUploadInfo: this._riskInfoForm.array([
                this.getfileUploadInfoModel(),
            ])

        });
    }
    getfileuploadModel() {
        return this._riskInfoForm.group({
            noteID: [''],
            uploadType: [''],
            fileName: [''],
            content: [''],
            fileType: ['']

        });
    }

    getExternalIDModel() {
        return this._riskInfoForm.group({
            purpose: [''],
            id: [''],
            key: ['']
        });
    }

    getfileUploadInfoModel() {
        return this._riskInfoForm.group({
            documentContent: [''],
            mimeType: [''],
            fileName: ['']

        });
    }

    getMARRiskInfoModel() {
        let riskInfoForm: FormGroup = this.getRiskInfoModel();
        riskInfoForm.addControl('voyageNumber', new FormControl(''));
        riskInfoForm.addControl('voyageType', new FormControl(''));
        riskInfoForm.addControl('invoiceNumber', new FormControl(''));
        riskInfoForm.addControl('lorryBillDate', new FormControl(''));
        riskInfoForm.addControl('certificateNumber', new FormControl(''));
        riskInfoForm.addControl('vesselLandingBillDate', new FormControl(''));
        riskInfoForm.addControl('letterOfCreditNumber', new FormControl(''));
        riskInfoForm.addControl('awbNumber', new FormControl(''));
        riskInfoForm.addControl('majorImportingCountryCode', new FormControl(''));
        riskInfoForm.addControl('majorImportingCountryDesc', new FormControl(''));
        riskInfoForm.addControl('majorExportingCountryCode', new FormControl(''));
        riskInfoForm.addControl('majorExportingCountryDesc', new FormControl(''));
        riskInfoForm.addControl('benificiaryBankBranch', new FormControl(''));
        riskInfoForm.addControl('benificiaryBankBranchDesc', new FormControl(''));
        riskInfoForm.addControl('purchaseType', new FormControl(''));
        riskInfoForm.addControl('purchaseTypeDesc', new FormControl(''));
        riskInfoForm.addControl('packersCode', new FormControl(''));
        riskInfoForm.addControl('packersCodeDesc', new FormControl(''));
        riskInfoForm.addControl('originatingCode', new FormControl(''));
        riskInfoForm.addControl('originatingCodeDesc', new FormControl(''));
        riskInfoForm.addControl('totalPackage', new FormControl(''));
        riskInfoForm.addControl('transitsFlag', new FormControl(''));
        riskInfoForm.addControl('multipleTransitsFlag', new FormControl(''));
        riskInfoForm.addControl('totalTranshipments', new FormControl(''));
        riskInfoForm.addControl('containerLoadCode', new FormControl(''));
        riskInfoForm.addControl('containerLoadCodeDesc', new FormControl(''));
        riskInfoForm.addControl('name1', new FormControl(''));
        riskInfoForm.addControl('name2', new FormControl(''));
        riskInfoForm.addControl('marks5', new FormControl(''));
        riskInfoForm.addControl('landValidityDays', new FormControl(''));
        riskInfoForm.addControl('airValidityDays', new FormControl(''));
        riskInfoForm.addControl('seaValidityDays', new FormControl(''));
        riskInfoForm.addControl('lossLimitBasisCode', new FormControl(''));
        riskInfoForm.addControl('lossLimitBasisCodeDesc', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountAOA', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountAOY', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountACT', new FormControl(''));
        riskInfoForm.addControl('lossLimitAmountFLB', new FormControl(''));
        riskInfoForm.addControl('benificiaryFlag', new FormControl(''));
        riskInfoForm.addControl('benificiaryName', new FormControl(''));
        riskInfoForm.addControl('plans', new FormArray([
            this._planInfo.getPAPlanInfoModel(),
        ]));
        return riskInfoForm;
    }

    getRiskInfoModel() {
        return this._riskInfoForm.group({
            policyNo: [''],
            policyEndtNo: [''],
            itemNo: [''],
            sectNo: [''],
            sectCl: [''],
            sectClDesc: [''],
            classScreenCode: [''],
            itemStatus: [''],
            itemSi: [''],
            itemPrm: [''],
            siCurr: [''],
            siCurrRt: [''],
            premCurr: [''],
            premCurrRt: [''],
            coverCode: [''],
            coverCodeDesc: [''],
            subItemNo: [''],
            subSectionNo: [''],
            key: [''],
            isHomeUnderLien: [''],
            mortgagePartyCodeOTH: [''],
            mortgagePartyCode: [''],
            mortgagePartyDesc: [''],
            mortgageExternalRefNumber: [''],
            mortgageTypeCode: [''],
            mortgageTypeCodeDesc: [''],
            mortgageNoticeDays: [''],
            mortgageExpiryDate: [''],
            additionalBoolean1: [''],
            additionalBoolean2: [''],
            additionalBoolean3: [''],
            additionalBoolean4: [''],
            additionalBoolean5: [''],
            additionalBoolean6: [''],
            additionalBoolean7: [''],
            additionalBoolean8: [''],
            additionalBoolean9: [''],
            additionalBoolean10: [''],
            additionalBoolean11: [''],
            additionalBoolean12: [''],
            additionalBoolean13: [''],
            additionalBoolean14: [''],
            additionalBoolean15: [''],
            additionalBoolean16: [''],
            additionalBoolean17: [''],
            additionalText1: [''],
            additionalText2: [''],
            additionalText3: [''],
            additionalText4: [''],
            additionalText5: [''],
            additionalText6: [''],
            additionalText7: [''],
            additionalText8: [''],
            additionalText9: [''],
            additionalText10: [''],
            additionalText11: [''],
            additionalText12: [''],
            additionalText13: [''],
            additionalText14: [''],
            additionalText15: [''],
            additionalText16: [''],
            additionalText17: [''],
            additionalText18: [''],
            additionalText19: [''],
            additionalText20: [''],
            additionalText21: [''],
            additionalText22: [''],
            additionalText23: [''],
            additionalText30: [''],
            additionalTextDesc1: [''],
            additionalTextDesc2: [''],
            additionalTextDesc3: [''],
            additionalTextDesc4: [''],
            additionalTextDesc5: [''],
            additionalTextDesc6: [''],
            additionalTextDesc7: [''],
            additionalTextDesc8: [''],
            additionalTextDesc9: [''],
            additionalTextDesc10: [''],
            additionalTextDesc11: [''],
            additionalTextDesc12: [''],
            additionalTextDesc13: [''],
            additionalTextDesc14: [''],
            additionalTextDesc15: [''],
            additionalTextDesc16: [''],
            additionalTextDesc17: [''],
            additionalTextDesc18: [''],
            additionalTextDesc19: [''],
            additionalTextDesc20: [''],
            additionalTextDesc21: [''],
            additionalTextDesc22: [''],
            additionalTextDesc23: [''],
            additionalNumber1: [''],
            additionalNumber2: [''],
            additionalNumber3: [''],
            additionalNumber4: [''],
            additionalNumber5: [''],
            nomineeInfo: this._riskInfoForm.array([
            ]),
            additionalRiskInfo: this._riskInfoForm.array([
            ]),
            subjectMatterInfo: this._riskInfoForm.array([
            ]),
            claimHistoryInfo: this._riskInfoForm.array([
            ])
        });
    }

    getENGRiskInfoModel() {
        let riskInfoForm: FormGroup = this.getRiskInfoModel();
        return riskInfoForm;
    }

    getWCRiskInfoModel() {
        let riskInfoForm: FormGroup = this.getRiskInfoModel();
        return riskInfoForm;
    }

    getLIARiskInfoModel() {
        let riskInfoForm: FormGroup = this.getRiskInfoModel();
        return riskInfoForm;
    }
}
