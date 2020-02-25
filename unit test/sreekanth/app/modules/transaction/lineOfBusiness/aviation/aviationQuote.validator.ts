import { MinSizeValidator } from './../../../../core/ui-components/validators/minsize/minsize.validator';
import { FormArray } from '@angular/forms/src/model';
import { EmailIdvalidators } from '../../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../../core/ui-components/validators/minnumber/minnumber.validator';
import { FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '../../../../core/ui-components/validators/maxsize/maxsize.validator';
import { CommonConstants } from '../../../constants/module.constants';

export class AviationQuoteValidator {
    aviationQuotFormGroup: FormGroup;
    isUSFlag: boolean = false;
    setAviationQuotValidator(aviationQuotFormGroup, isUSFlag?) {
        this.aviationQuotFormGroup = aviationQuotFormGroup;
        this.aviationQuotFormGroup.controls['policyInfo'].get('hobbyRec').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['policyInfo'].get('hobbyRec').updateValueAndValidity();
        if (isUSFlag && isUSFlag === true) {
            this.isUSFlag = isUSFlag;
            this.aviationQuotFormGroup.controls['policyInfo'].get('operateCommercialUs').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['policyInfo'].get('operateCommercialUs').updateValueAndValidity();
        }
        this.aviationQuotFormGroup.controls['policyInfo'].get('coverageType').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['policyInfo'].get('coverageType').updateValueAndValidity();
        return this.aviationQuotFormGroup;
    }

    public setQuoteCustomerInfoValidator(aviationQuotFormGroup: FormGroup, userRoleID) {
        this.aviationQuotFormGroup = aviationQuotFormGroup;
        this.aviationQuotFormGroup.controls['customerInfo'].get('customerName').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('customerName').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('address1').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('address1').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('cityCode').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('cityDesc').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
        if (this.isUSFlag) {
            this.aviationQuotFormGroup.controls['customerInfo'].get('countyCode').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('countyCode').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('countyDesc').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('countyDesc').updateValueAndValidity();
        }
        this.aviationQuotFormGroup.controls['customerInfo'].get('state').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('state').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('stateDesc').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('website').setValidators(Validators.compose([Validators.pattern('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}')]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('website').updateValueAndValidity();
        if (userRoleID === CommonConstants.BROKER_AGENT_ROLE_ID) {
            this.aviationQuotFormGroup.controls['customerInfo'].get('servicingAgent').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('servicingAgent').updateValueAndValidity();
        }
        let customerInfo: FormArray = <FormArray>this.aviationQuotFormGroup.controls['customerInfo'];
        let additionalInsurerListGroup: FormArray = <FormArray>customerInfo.get('additionalInsurerList');
        additionalInsurerListGroup.at(0).get('addapplicantName').setValidators(Validators.compose([Validators.required]));
        additionalInsurerListGroup.at(0).get('addapplicantName').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('streetname').setValidators(Validators.compose([Validators.required]));
        // additionalInsurerListGroup.at(0).get('streetname').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('cityCode').setValidators(Validators.compose([Validators.required]));
        // additionalInsurerListGroup.at(0).get('cityCode').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('cityDesc').setValidators(Validators.compose([Validators.required]));
        // additionalInsurerListGroup.at(0).get('cityDesc').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('zipCode').setValidators(Validators.compose([Validators.required]));
        // additionalInsurerListGroup.at(0).get('zipCode').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('stateCd').setValidators(Validators.compose([Validators.required]));
        // additionalInsurerListGroup.at(0).get('stateCd').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('stateDesc').setValidators(Validators.compose([Validators.required]));
        // additionalInsurerListGroup.at(0).get('stateDesc').updateValueAndValidity();
        return this.aviationQuotFormGroup;
    }

    clearAVIQuotValidatorsBasicDetails(aviationQuotFormGroup): FormGroup {
        this.aviationQuotFormGroup = aviationQuotFormGroup;
        this.aviationQuotFormGroup.controls['customerInfo'].get('customerName').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('customerName').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('address1').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('address1').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('zipCd').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('cityCode').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('cityDesc').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('countyCode').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('countyCode').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('countyDesc').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('countyDesc').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('state').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('state').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('stateDesc').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('mobilePh').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity(); this.aviationQuotFormGroup.controls['customerInfo'].get('emailId').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('website').setValidators(Validators.compose([Validators.pattern('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}')]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('website').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('servicingAgent').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('servicingAgent').updateValueAndValidity();
        let customerInfo: FormArray = <FormArray>this.aviationQuotFormGroup.controls['customerInfo'];
        let additionalInsurerListGroup: FormArray = <FormArray>customerInfo.get('additionalInsurerList');
        // additionalInsurerListGroup.at(0).get('addapplicantName').setValidators(null);
        // additionalInsurerListGroup.at(0).get('addapplicantName').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('streetname').setValidators(null);
        // additionalInsurerListGroup.at(0).get('streetname').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('cityCode').setValidators(null);
        // additionalInsurerListGroup.at(0).get('cityCode').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('cityDesc').setValidators(null);
        // additionalInsurerListGroup.at(0).get('cityDesc').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('zipCode').setValidators(null);
        // additionalInsurerListGroup.at(0).get('zipCode').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('stateCd').setValidators(null);
        // additionalInsurerListGroup.at(0).get('stateCd').updateValueAndValidity();
        // additionalInsurerListGroup.at(0).get('stateDesc').setValidators(null);
        // additionalInsurerListGroup.at(0).get('stateDesc').updateValueAndValidity();
        return this.aviationQuotFormGroup;
    }

    setAdditionalInsuredListValidator(additionalInsured) {
        // additionalInsured.get('addapplicantName').setValidators(Validators.compose([Validators.required]));
        // additionalInsured.get('addapplicantName').updateValueAndValidity();
        // additionalInsured.get('streetname').setValidators(Validators.compose([Validators.required]));
        // additionalInsured.get('streetname').updateValueAndValidity();
        // additionalInsured.get('cityCode').setValidators(Validators.compose([Validators.required]));
        // additionalInsured.get('cityCode').updateValueAndValidity();
        // additionalInsured.get('cityDesc').setValidators(Validators.compose([Validators.required]));
        // additionalInsured.get('cityDesc').updateValueAndValidity();
        // additionalInsured.get('zipCode').setValidators(Validators.compose([Validators.required]));
        // additionalInsured.get('zipCode').updateValueAndValidity();
        // additionalInsured.get('stateCd').setValidators(Validators.compose([Validators.required]));
        // additionalInsured.get('stateCd').updateValueAndValidity();
        // additionalInsured.get('stateDesc').setValidators(Validators.compose([Validators.required]));
        // additionalInsured.get('stateDesc').updateValueAndValidity();
        return additionalInsured;
    }

    public setQuoteRiskValidatorBasicDetails(aviationQuotFormGroup: FormGroup, productCode?: string): FormGroup {
        this.aviationQuotFormGroup = aviationQuotFormGroup;
        let riskInfoArray: FormArray = <FormArray>this.aviationQuotFormGroup.controls['riskInfo'];
        for (let i = 0; i < riskInfoArray.length; i++) {
            let additionalInsurerListGroup: FormArray = <FormArray>riskInfoArray.at(i).get('pilotInfo');
            for (let j = 0; j < additionalInsurerListGroup.length; j++) {
                // additionalInsurerListGroup.at(i).get('pilotName').setValidators(Validators.compose([Validators.required]));
                // additionalInsurerListGroup.at(i).get('pilotName').updateValueAndValidity();
                // additionalInsurerListGroup.at(i).get('airmanCertificate').setValidators(Validators.compose([Validators.required]));
                // additionalInsurerListGroup.at(i).get('airmanCertificate').updateValueAndValidity();
            }
            return this.aviationQuotFormGroup;
        }
    }

    public clearAVIRiskValidatorsBasicDetails(aviationQuotFormGroup: FormGroup, productCode?: string): FormGroup {
        this.aviationQuotFormGroup = aviationQuotFormGroup;
        let riskInfoArray: FormArray = <FormArray>this.aviationQuotFormGroup.controls['riskInfo'];
        for (let i = 0; i < riskInfoArray.length; i++) {
            let additionalInsurerListGroup: FormArray = <FormArray>riskInfoArray.at(i).get('pilotInfo');
            for (let j = 0; j < additionalInsurerListGroup.length; j++) {
                // additionalInsurerListGroup.at(i).get('pilotName').setValidators(null);
                // additionalInsurerListGroup.at(i).get('pilotName').updateValueAndValidity();
                // additionalInsurerListGroup.at(i).get('airmanCertificate').setValidators(null);
                // additionalInsurerListGroup.at(i).get('airmanCertificate').updateValueAndValidity();
            }
            return this.aviationQuotFormGroup;
        }
    }

    setQuoteRiskValidators(riskGroup, multiItemFlag: boolean = false) {
        let planArray: FormArray = <FormArray>riskGroup.get('plans');
        planArray.at(0).get('planTypeCode').setValidators(Validators.compose([Validators.required]));
        planArray.at(0).get('planTypeCode').updateValueAndValidity();
        return riskGroup;
    }

    clearAviationQuotValidators(_aviationQuotFormGroup) {
        this.aviationQuotFormGroup = _aviationQuotFormGroup;
        this.aviationQuotFormGroup.clearValidators();
        return this.aviationQuotFormGroup;
    }
    setAviationQuotInsuredValidator(_aviationQuotFormGroup) {
        this.aviationQuotFormGroup = _aviationQuotFormGroup;
        this.aviationQuotFormGroup.controls['customerInfo'].get('policyHolderType').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('policyHolderType').updateValueAndValidity();
        if (this.aviationQuotFormGroup.controls['customerInfo'].get('policyHolderType').value === 'O') {
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('prefix').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('prefix').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
         //   this.aviationQuotFormGroup.controls['customerInfo'].get('age').setValidators(null);
         //   this.aviationQuotFormGroup.controls['customerInfo'].get('age').reset();
         //   this.aviationQuotFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        } else {
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationDesc').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationDesc').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').setValidators(null);
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').reset();
            this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').updateValueAndValidity();

            this.aviationQuotFormGroup.controls['customerInfo'].get('prefix').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('prefix').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
          //  this.aviationQuotFormGroup.controls['customerInfo'].get('age').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(18)]));
          //  this.aviationQuotFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
            this.aviationQuotFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        }
        this.aviationQuotFormGroup.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(6)]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.aviationQuotFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].updateValueAndValidity();
        let customerInfo: FormArray = <FormArray>this.aviationQuotFormGroup.controls['customerInfo'];
        let additionalInsurerList: FormArray = <FormArray>customerInfo.get('additionalInsurerList');
        for (let j = 0; j < additionalInsurerList.length; j++) {
            let tempAdditionalInsurerList: FormArray = <FormArray>additionalInsurerList.at(j);
            tempAdditionalInsurerList = this.setAdditionalInsuredValidator(tempAdditionalInsurerList);
        }
        // this.aviationQuotFormGroup.controls['policyInfo'] = policyInfoArray;
        // this.aviationQuotFormGroup.controls['policyInfo'].updateValueAndValidity();
        this.aviationQuotFormGroup = this.riskDroneInfoValidator(this.aviationQuotFormGroup, 0);
        return this.aviationQuotFormGroup;

    }

    riskDroneInfoValidator(_aviationQuotFormGroup, index) {
        this.aviationQuotFormGroup = _aviationQuotFormGroup;
        let riskInfoArray: FormArray = <FormArray>this.aviationQuotFormGroup.controls['riskInfo'];
        let aviationPilotVOList: FormArray = <FormArray>riskInfoArray.at(index).get('pilotInfo');
        let tempAviationPilotVOList: FormArray = <FormArray>aviationPilotVOList.at(0);
        tempAviationPilotVOList = this.setPilotInsuredValidator(tempAviationPilotVOList);
        this.aviationQuotFormGroup.controls['riskInfo'] = riskInfoArray;
        this.aviationQuotFormGroup.controls['riskInfo'].updateValueAndValidity();
        return this.aviationQuotFormGroup;

    }
    setAdditionalInsuredValidator(additionalInsured) {
        additionalInsured.get('addapplicantName').setValidators(Validators.required);
        additionalInsured.get('addapplicantName').updateValueAndValidity();
        additionalInsured.get('streetname').setValidators(Validators.required);
        additionalInsured.get('streetname').updateValueAndValidity();
        additionalInsured.get('cityCode').setValidators(Validators.required);
        additionalInsured.get('cityCode').updateValueAndValidity();
        additionalInsured.get('cityDesc').setValidators(Validators.required);
        additionalInsured.get('cityDesc').updateValueAndValidity();
        additionalInsured.get('zipCode').setValidators(Validators.required);
        additionalInsured.get('zipCode').updateValueAndValidity();
        additionalInsured.get('stateCd').setValidators(Validators.required);
        additionalInsured.get('stateCd').updateValueAndValidity();
        additionalInsured.get('stateDesc').setValidators(Validators.required);
        additionalInsured.get('stateDesc').updateValueAndValidity();

        return additionalInsured;
    }

    setPilotInsuredValidator(pilotInsured) {
        pilotInsured.get('pilotFName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
        pilotInsured.get('pilotFName').updateValueAndValidity();
        pilotInsured.get('pilotLName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
        pilotInsured.get('pilotLName').updateValueAndValidity();
        return pilotInsured;
    }

    setEmailQuoteModalValidator(_emailModalaviationQuotFormGroup) {
        this.aviationQuotFormGroup = _emailModalaviationQuotFormGroup;
        this.aviationQuotFormGroup.controls['emailQuotInfo'].get('toAddress').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.aviationQuotFormGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        return this.aviationQuotFormGroup;
    }
    setReferQuotemodalValidators(referQuoteFormGroup) {
        referQuoteFormGroup.controls['referQuotInfo'].get('referralRemarks').setValidators(Validators.maxLength(200));
        return referQuoteFormGroup;
    }


    clearInsuredTabValidation(_aviationQuotFormGroup) {
        this.aviationQuotFormGroup = _aviationQuotFormGroup;
        let riskInfoArray: FormArray = <FormArray>this.aviationQuotFormGroup.controls['riskInfo'];
        for (let i = 0; i < riskInfoArray.length; i++) {
            let aviationPilotVOList: FormArray = <FormArray>riskInfoArray.at(i).get('pilotInfo');
            for (let j = 0; j < aviationPilotVOList.length; j++) {
                aviationPilotVOList.at(j).get('pilotFName').setValidators(null);
                aviationPilotVOList.at(j).get('pilotFName').reset();
                aviationPilotVOList.at(j).get('pilotFName').updateValueAndValidity();
                aviationPilotVOList.at(j).get('pilotLName').setValidators(null);
                aviationPilotVOList.at(j).get('pilotLName').reset();
                aviationPilotVOList.at(j).get('pilotLName').updateValueAndValidity();
            }
        }
        this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateCode').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('typeOfCorporateDesc').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('prefix').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('prefix').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
     //   this.aviationQuotFormGroup.controls['customerInfo'].get('age').setValidators(null);
     //   this.aviationQuotFormGroup.controls['customerInfo'].get('age').reset();
     //   this.aviationQuotFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').reset();
        this.aviationQuotFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.aviationQuotFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
        this.aviationQuotFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();

        let policyInfoArray: FormArray = <FormArray>this.aviationQuotFormGroup.controls['policyInfo'];
        let additionalInsurerList: FormArray = <FormArray>policyInfoArray.get('additionalInsurerList');
        for (let k = 0; k < additionalInsurerList.length; k++) {
            additionalInsurerList.at(k).get('companyName').setValidators(null);
            additionalInsurerList.at(k).get('companyName').reset();
            additionalInsurerList.at(k).get('companyName').updateValueAndValidity();
            additionalInsurerList.at(k).get('companyRegNumber').setValidators(null);
            additionalInsurerList.at(k).get('companyRegNumber').reset();
            additionalInsurerList.at(k).get('companyRegNumber').updateValueAndValidity();
            additionalInsurerList.at(k).get('tradeID').setValidators(null);
            additionalInsurerList.at(k).get('tradeID').reset();
            additionalInsurerList.at(k).get('tradeID').updateValueAndValidity();
            additionalInsurerList.at(k).get('typeOfCorporateCode').setValidators(null);
            additionalInsurerList.at(k).get('typeOfCorporateCode').reset();
            additionalInsurerList.at(k).get('typeOfCorporateCode').updateValueAndValidity();
            additionalInsurerList.at(k).get('typeOfCorporateDesc').setValidators(null);
            additionalInsurerList.at(k).get('typeOfCorporateDesc').reset();
            additionalInsurerList.at(k).get('typeOfCorporateDesc').updateValueAndValidity();
            additionalInsurerList.at(k).get('zip').setValidators(null);
            additionalInsurerList.at(k).get('zip').reset();
            additionalInsurerList.at(k).get('zip').updateValueAndValidity();

        }
        this.aviationQuotFormGroup.controls['riskInfo'] = riskInfoArray;
        this.aviationQuotFormGroup.controls['riskInfo'].updateValueAndValidity();
        this.aviationQuotFormGroup.controls['policyInfo'] = policyInfoArray;
        this.aviationQuotFormGroup.controls['policyInfo'].updateValueAndValidity();
        return this.aviationQuotFormGroup;

    }


}
