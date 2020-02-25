import { MinSizeValidator } from './../../../../core/ui-components/validators/minsize/minsize.validator';
import { FormArray } from '@angular/forms/src/model';
import { EmailIdvalidators } from '../../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../../core/ui-components/validators/minnumber/minnumber.validator';
import { FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '../../../../core/ui-components/validators/maxsize/maxsize.validator';

export class AviationPolicyValidator {
    aviationQuotForm: FormGroup;
    setAviationQuotValidator(aviationQuotForm) {
        this.aviationQuotForm = aviationQuotForm;
            this.aviationQuotForm.controls['policyInfo'].get('policyPurpose').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['policyInfo'].get('policyPurpose').updateValueAndValidity();
            if(this.aviationQuotForm.controls['policyInfo'].get('policyPurpose').value==='R'){
                this.aviationQuotForm.controls['policyInfo'].get('flyingTerritory').setValidators(Validators.compose([Validators.required]));
                this.aviationQuotForm.controls['policyInfo'].get('flyingTerritory').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('policyTermHr').setValidators(Validators.compose([Validators.required]));
                this.aviationQuotForm.controls['policyInfo'].get('policyTermHr').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('inceptionDt').setValidators(null);
                this.aviationQuotForm.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('expiryDt').setValidators(null);
                this.aviationQuotForm.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('PolicyType').setValidators(null);
                this.aviationQuotForm.controls['policyInfo'].get('PolicyType').reset();
                this.aviationQuotForm.controls['policyInfo'].get('PolicyType').updateValueAndValidity();
                }
                else
                {
                this.aviationQuotForm.controls['policyInfo'].get('flyingTerritory').setValidators(null);
                this.aviationQuotForm.controls['policyInfo'].get('flyingTerritory').reset();
                this.aviationQuotForm.controls['policyInfo'].get('flyingTerritory').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('policyTermHr').setValidators(null);
                this.aviationQuotForm.controls['policyInfo'].get('policyTermHr').reset();
                this.aviationQuotForm.controls['policyInfo'].get('policyTermHr').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('inceptionDt').setValidators(Validators.compose([Validators.required]));
                this.aviationQuotForm.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('expiryDt').setValidators(Validators.compose([Validators.required]));
                this.aviationQuotForm.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                this.aviationQuotForm.controls['policyInfo'].get('PolicyType').setValidators(Validators.compose([Validators.required]));
                this.aviationQuotForm.controls['policyInfo'].get('PolicyType').updateValueAndValidity();    
            }
            return this.aviationQuotForm;
    }
    setQuoteRiskValidators(riskGroup,multiItemFlag:boolean=false) {
        let planArray: FormArray = <FormArray>riskGroup.get('plans');
        planArray.at(0).get('planTypeCode').setValidators(Validators.compose([Validators.required]));
        planArray.at(0).get('planTypeCode').updateValueAndValidity();
        return riskGroup;
    }

    clearAviationQuotValidators(_aviationQuotForm) {
        this.aviationQuotForm = _aviationQuotForm;
        this.aviationQuotForm.clearValidators();
        return this.aviationQuotForm;
    }
    setAviationQuotInsuredValidator(_aviationQuotForm) {
        this.aviationQuotForm = _aviationQuotForm;
        this.aviationQuotForm.controls['customerInfo'].get('policyHolderType').setValidators(Validators.compose([Validators.required]));
        this.aviationQuotForm.controls['customerInfo'].get('policyHolderType').updateValueAndValidity();
        if (this.aviationQuotForm.controls['customerInfo'].get('policyHolderType').value === 'O') {
            this.aviationQuotForm.controls['customerInfo'].get('companyName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.aviationQuotForm.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('occupationCode').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('prefix').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('prefix').reset();
            this.aviationQuotForm.controls['customerInfo'].get('appFName').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('appFName').reset();
            this.aviationQuotForm.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('appLName').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('appLName').reset();
            this.aviationQuotForm.controls['customerInfo'].get('appLName').updateValueAndValidity();
         //   this.aviationQuotForm.controls['customerInfo'].get('age').setValidators(null);
          //  this.aviationQuotForm.controls['customerInfo'].get('age').reset();
          //  this.aviationQuotForm.controls['customerInfo'].get('age').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('DOB').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('DOB').reset();
            this.aviationQuotForm.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeCode').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('identityNo').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        } else {
            this.aviationQuotForm.controls['customerInfo'].get('companyName').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('companyName').reset();
            this.aviationQuotForm.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').reset();
            this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('occupationCode').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('occupationCode').reset();
            this.aviationQuotForm.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('occupationDesc').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('occupationDesc').reset();
            this.aviationQuotForm.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').reset();
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').setValidators(null);
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').reset();
            this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').updateValueAndValidity();

            this.aviationQuotForm.controls['customerInfo'].get('prefix').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('prefix').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('appFName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.aviationQuotForm.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('appLName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.aviationQuotForm.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('DOB').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('DOB').updateValueAndValidity();
          //  this.aviationQuotForm.controls['customerInfo'].get('age').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(18)]));
          //  this.aviationQuotForm.controls['customerInfo'].get('age').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeDesc').setValidators(Validators.compose([Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.aviationQuotForm.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
            this.aviationQuotForm.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        }
        this.aviationQuotForm.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(6)]));
        this.aviationQuotForm.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.aviationQuotForm.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].updateValueAndValidity();
        let policyInfoArray: FormArray = <FormArray>this.aviationQuotForm.controls['policyInfo'];
        let additionalInsurerList: FormArray = <FormArray>policyInfoArray.get('additionalInsurerList');
        let tempAdditionalInsurerList : FormArray = <FormArray>additionalInsurerList.at(0);
        tempAdditionalInsurerList= this.setAdditionalInsuredValidator(tempAdditionalInsurerList);
        this.aviationQuotForm.controls['policyInfo'] = policyInfoArray;
        this.aviationQuotForm.controls['policyInfo'].updateValueAndValidity();
        this.aviationQuotForm = this.riskDroneInfoValidator(this.aviationQuotForm,0);
        return this.aviationQuotForm;

    }

    riskDroneInfoValidator(_aviationQuotForm,index){
        this.aviationQuotForm = _aviationQuotForm;
        let riskInfoArray: FormArray = <FormArray>this.aviationQuotForm.controls['riskInfo'];
        let aviationPilotVOList: FormArray = <FormArray>riskInfoArray.at(index).get('aviationPilotVOList');
        let tempAviationPilotVOList: FormArray = <FormArray>aviationPilotVOList.at(0);
        tempAviationPilotVOList= this.setPilotInsuredValidator(tempAviationPilotVOList);
        riskInfoArray.at(index).get('makeDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(index).get('makeDesc').updateValueAndValidity();
        riskInfoArray.at(index).get('makeCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(index).get('makeCode').updateValueAndValidity();
        riskInfoArray.at(index).get('modelCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(index).get('modelCode').updateValueAndValidity();
        riskInfoArray.at(index).get('modelDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(index).get('modelDesc').updateValueAndValidity();
        riskInfoArray.at(index).get('droneManufacturingYear').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(index).get('droneManufacturingYear').updateValueAndValidity();
        this.aviationQuotForm.controls['riskInfo'] = riskInfoArray;
        this.aviationQuotForm.controls['riskInfo'].updateValueAndValidity(); 
        return this.aviationQuotForm;

    }
    setAdditionalInsuredValidator(additionalInsured){
            additionalInsured.get('companyName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            additionalInsured.get('companyName').updateValueAndValidity();
            additionalInsured.get('companyRegNumber').setValidators(Validators.compose([Validators.required]));
            additionalInsured.get('companyRegNumber').updateValueAndValidity();
            additionalInsured.get('tradeID').setValidators(Validators.compose([Validators.required]));
            additionalInsured.get('tradeID').updateValueAndValidity();
            additionalInsured.get('typeOfCorporateCode').setValidators(Validators.compose([Validators.required]));
            additionalInsured.get('typeOfCorporateCode').updateValueAndValidity();
            additionalInsured.get('typeOfCorporateDesc').setValidators(Validators.compose([Validators.required]));
            additionalInsured.get('typeOfCorporateDesc').updateValueAndValidity();
            additionalInsured.get('zip').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(6)]));
            additionalInsured.get('zip').updateValueAndValidity();
            return additionalInsured;
    }

    setPilotInsuredValidator(pilotInsured){
        pilotInsured.get('pilotFName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
        pilotInsured.get('pilotFName').updateValueAndValidity();
        pilotInsured.get('pilotLName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
        pilotInsured.get('pilotLName').updateValueAndValidity();
        return pilotInsured;
    }

    setEmailQuoteModalValidator(_emailModalaviationQuotForm) {
        this.aviationQuotForm = _emailModalaviationQuotForm;
        this.aviationQuotForm.controls['emailQuotInfo'].get('toAddress').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.aviationQuotForm.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        return this.aviationQuotForm;
    }
    setReferQuotemodalValidators(referQuoteFormGroup) {
        referQuoteFormGroup.controls['referQuotInfo'].get('referralRemarks').setValidators(Validators.maxLength(200));
        return referQuoteFormGroup;
    }


    clearInsuredTabValidation(_aviationQuotForm){
        this.aviationQuotForm = _aviationQuotForm;
        let riskInfoArray: FormArray = <FormArray>this.aviationQuotForm.controls['riskInfo'];
        for (let i=0; i<  riskInfoArray.length; i++)
        {
        riskInfoArray.at(i).get('makeDesc').setValidators(null);
        riskInfoArray.at(i).get('makeDesc').reset();
        riskInfoArray.at(i).get('makeDesc').updateValueAndValidity();
        riskInfoArray.at(i).get('makeCode').setValidators(null);
        riskInfoArray.at(i).get('makeCode').reset();
        riskInfoArray.at(i).get('makeCode').updateValueAndValidity();
        riskInfoArray.at(i).get('modelCode').setValidators(null);
        riskInfoArray.at(i).get('modelCode').reset();
        riskInfoArray.at(i).get('modelCode').updateValueAndValidity();
        riskInfoArray.at(i).get('modelDesc').setValidators(null);
        riskInfoArray.at(i).get('modelDesc').reset();
        riskInfoArray.at(i).get('modelDesc').updateValueAndValidity();
        riskInfoArray.at(i).get('droneManufacturingYear').setValidators(null);
        riskInfoArray.at(i).get('droneManufacturingYear').reset();
        riskInfoArray.at(i).get('droneManufacturingYear').updateValueAndValidity();
        let aviationPilotVOList: FormArray = <FormArray>riskInfoArray.at(i).get('aviationPilotVOList');
        for (let j=0; j<  aviationPilotVOList.length; j++)
            {
                aviationPilotVOList.at(j).get('pilotFName').setValidators(null);
                aviationPilotVOList.at(j).get('pilotFName').reset();
                aviationPilotVOList.at(j).get('pilotFName').updateValueAndValidity();
                aviationPilotVOList.at(j).get('pilotLName').setValidators(null);
                aviationPilotVOList.at(j).get('pilotLName').reset();
                aviationPilotVOList.at(j).get('pilotLName').updateValueAndValidity();
            }
        }
        this.aviationQuotForm.controls['customerInfo'].get('companyName').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('companyName').reset();
        this.aviationQuotForm.controls['customerInfo'].get('companyName').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').reset();
        this.aviationQuotForm.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('occupationCode').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('occupationCode').reset();
        this.aviationQuotForm.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').reset();
        this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateCode').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').reset();
        this.aviationQuotForm.controls['customerInfo'].get('typeOfCorporateDesc').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('prefix').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('prefix').reset();
        this.aviationQuotForm.controls['customerInfo'].get('appFName').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('appFName').reset();
        this.aviationQuotForm.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('appLName').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('appLName').reset();
        this.aviationQuotForm.controls['customerInfo'].get('appLName').updateValueAndValidity();
      //  this.aviationQuotForm.controls['customerInfo'].get('age').setValidators(null);
     //   this.aviationQuotForm.controls['customerInfo'].get('age').reset();
      //  this.aviationQuotForm.controls['customerInfo'].get('age').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('DOB').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('DOB').reset();
        this.aviationQuotForm.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('identityTypeCode').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.aviationQuotForm.controls['customerInfo'].get('identityNo').setValidators(null);
        this.aviationQuotForm.controls['customerInfo'].get('identityNo').updateValueAndValidity();

        let policyInfoArray: FormArray = <FormArray>this.aviationQuotForm.controls['customerInfo'];
        let additionalInsurerList: FormArray = <FormArray>policyInfoArray.get('additionalInsurerList');
        for (let k=0; k<  additionalInsurerList.length; k++)
        {
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
        this.aviationQuotForm.controls['riskInfo'] = riskInfoArray;
        this.aviationQuotForm.controls['riskInfo'].updateValueAndValidity(); 
        this.aviationQuotForm.controls['policyInfo'] = policyInfoArray;
        this.aviationQuotForm.controls['policyInfo'].updateValueAndValidity(); 
        return this.aviationQuotForm;  

    }

    
}