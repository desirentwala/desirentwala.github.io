import { MinSizeValidator } from './../../../../../core/ui-components/validators/minsize/minsize.validator';
import { FormArray } from '@angular/forms/src/model';
import { EmailIdvalidators } from '../../../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../../../core/ui-components/validators/minnumber/minnumber.validator';
import { FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '../../../../../core/ui-components/validators/maxsize/maxsize.validator';

export class PersonalMotorQuoteValidator {
    pmQuoteFormGroup: FormGroup;
    setPMQuoteValidatorBasicDetails(PMQuoteForm: FormGroup, productCode?: string): FormGroup {
        this.pmQuoteFormGroup = PMQuoteForm;
        let riskInfoArray: FormArray = <FormArray>this.pmQuoteFormGroup.controls['riskInfo'];
        let plansArray: FormArray = <FormArray>riskInfoArray.at(0).get('plans');
        riskInfoArray.at(0).get('displayPlanTypeCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('displayPlanTypeCode').updateValueAndValidity();
        riskInfoArray.at(0).get('displayPlanTypeDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('displayPlanTypeDesc').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleMakeCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('vehicleMakeCode').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleModelCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('vehicleModelCode').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleManufacturingYear').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('vehicleManufacturingYear').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['policyInfo'].get('inceptionDt').setValidators(Validators.compose([Validators.required]));
        this.pmQuoteFormGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['policyInfo'].get('expiryDt').setValidators(Validators.compose([Validators.required]));
        this.pmQuoteFormGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['policyInfo'].get('durationInDays').setValidators(Validators.compose([MinNumberValidator.minNumber(1), Validators.maxLength(3)]));
        this.pmQuoteFormGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
        return this.pmQuoteFormGroup;
    }
    clearPMQuotValidatorsBasicDetails(pmQuotForm): FormGroup {
        this.pmQuoteFormGroup = pmQuotForm;
        let riskInfoArray: FormArray = <FormArray>this.pmQuoteFormGroup.controls['riskInfo'];
        let plansArray: FormArray = <FormArray>riskInfoArray.at(0).get('plans');
        plansArray.at(0).get('planTypeCode').setValidators(null);
        plansArray.at(0).get('planTypeCode').updateValueAndValidity();
        plansArray.at(0).get('planTypeDesc').setValidators(null);
        plansArray.at(0).get('planTypeDesc').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleMakeCode').setValidators(null);
        riskInfoArray.at(0).get('vehicleMakeCode').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleModelCode').setValidators(null);
        riskInfoArray.at(0).get('vehicleModelCode').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleManufacturingYear').setValidators(null);
        riskInfoArray.at(0).get('vehicleManufacturingYear').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['policyInfo'].get('inceptionDt').setValidators(null);
        this.pmQuoteFormGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['policyInfo'].get('expiryDt').setValidators(null);
        this.pmQuoteFormGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['policyInfo'].get('durationInDays').setValidators(null);
        this.pmQuoteFormGroup.controls['policyInfo'].get('durationInDays').reset();
        this.pmQuoteFormGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();

        return this.pmQuoteFormGroup;
    }
    setPMQuoteInsuredInfoValidator(PMQuoteForm): FormGroup {
        let riskInfoArray: FormArray = <FormArray>this.pmQuoteFormGroup.controls['riskInfo'];
        let insuredArray: FormArray = <FormArray>riskInfoArray.at(0).get('insuredList');
        insuredArray.at(0).get('appFName').setValidators(Validators.compose([MaxSizeValidator.maxSize(30), Validators.required, Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+')]));
        insuredArray.at(0).get('appFName').updateValueAndValidity();
        insuredArray.at(0).get('appLName').setValidators(Validators.compose([MaxSizeValidator.maxSize(30), Validators.required, Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+')]));
        insuredArray.at(0).get('appLName').updateValueAndValidity();
        insuredArray.at(0).get('identityNo').setValidators(Validators.required);
        insuredArray.at(0).get('identityNo').updateValueAndValidity();
        return this.pmQuoteFormGroup;
    }
    clearPMQuoteInsuredInfoValidator(PMQuoteForm): FormGroup {
        let riskInfoArray: FormArray = <FormArray>this.pmQuoteFormGroup.controls['riskInfo'];
        let insuredArray: FormArray = <FormArray>riskInfoArray.at(0).get('insuredList');
        insuredArray.at(0).get('appFName').setValidators(null);
        insuredArray.at(0).get('appFName').updateValueAndValidity();
        insuredArray.at(0).get('appLName').setValidators(null);
        insuredArray.at(0).get('appLName').updateValueAndValidity();
        insuredArray.at(0).get('identityNo').setValidators(null);
        insuredArray.at(0).get('identityNo').updateValueAndValidity();
        return this.pmQuoteFormGroup;
    }
    setInsuredValidators(PMQuoteForm, InsuredListFormArray: FormArray) {
        InsuredListFormArray.get('appFName').setValidators(Validators.required);
        InsuredListFormArray.get('appLName').setValidators(Validators.required);
        InsuredListFormArray.get('identityNo').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(20)]));
        return InsuredListFormArray;
    }
    clearSetInsuredValidators(InsuredListFormArray: FormArray) {
        InsuredListFormArray.get('appFName').setValidators(null);
        InsuredListFormArray.get('appFName').updateValueAndValidity();
        InsuredListFormArray.get('appLName').setValidators(null);
        InsuredListFormArray.get('appLName').updateValueAndValidity();
        InsuredListFormArray.get('identityNo').setValidators(null);
        InsuredListFormArray.get('identityNo').updateValueAndValidity();
        InsuredListFormArray.clearValidators();
        InsuredListFormArray.updateValueAndValidity();
        return InsuredListFormArray;
    }
    setEmailQuoteModalValidator(_emailModalTravelQuotForm) {
        this.pmQuoteFormGroup = _emailModalTravelQuotForm;
        this.pmQuoteFormGroup.controls['emailQuotInfo'].get('toAddress').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.pmQuoteFormGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        return this.pmQuoteFormGroup;
    }
    setReferQuoteModalValidator(_referQuoteModalForm) {
        this.pmQuoteFormGroup = _referQuoteModalForm;
        this.pmQuoteFormGroup.controls['referQuotInfo'].get('referTo').setValidators(Validators.compose([EmailIdvalidators.multiplemailFormat(','), Validators.required]));
        this.pmQuoteFormGroup.controls['referQuotInfo'].get('referTo').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['referQuotInfo'].get('ccAddress').setValidators(Validators.compose([EmailIdvalidators.multiplemailFormat(',')]));
        this.pmQuoteFormGroup.controls['referQuotInfo'].get('ccAddress').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['referQuotInfo'].get('referralRemarks').setValidators(Validators.compose([Validators.required]));
        this.pmQuoteFormGroup.controls['referQuotInfo'].get('referralRemarks').updateValueAndValidity();
        return this.pmQuoteFormGroup;
    }
    setPMQuoteValidatorProposal(PMQuoteForm): FormGroup {
        let riskInfoArray: FormArray = <FormArray>this.pmQuoteFormGroup.controls['riskInfo'];
        riskInfoArray.at(0).get('vehicleEngineNo').setValidators(Validators.required);
        riskInfoArray.at(0).get('vehicleEngineNo').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleRegNo').setValidators(Validators.required);
        riskInfoArray.at(0).get('vehicleRegNo').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleChassisNo').setValidators(Validators.required);
        riskInfoArray.at(0).get('vehicleChassisNo').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['riskInfo'].updateValueAndValidity();
        if (this.pmQuoteFormGroup.controls['customerInfo'].get('policyHolderType').value === 'I') {
            this.pmQuoteFormGroup.controls['customerInfo'].get('prefix').setValidators(Validators.required);
            this.pmQuoteFormGroup.controls['customerInfo'].get('prefix').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.compose([MaxSizeValidator.maxSize(30), Validators.required, Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+')]));
            this.pmQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('appMName').setValidators(Validators.compose([MaxSizeValidator.maxSize(30), Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+')]));
            this.pmQuoteFormGroup.controls['customerInfo'].get('appMName').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.compose([MaxSizeValidator.maxSize(30), Validators.required, Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+')]));
            this.pmQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('DOB').setValidators(Validators.compose([Validators.required]));
            this.pmQuoteFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            // tslint:disable-next-line:max-line-length
            this.pmQuoteFormGroup.controls['customerInfo'].get('age').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(18)]));
            this.pmQuoteFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            // tslint:disable-next-line:max-line-length
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(20)]));
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.required);
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        }
        this.pmQuoteFormGroup.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(6)]));
        this.pmQuoteFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required, MinSizeValidator.minSize(9), MaxSizeValidator.maxSize(20)]));
        this.pmQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.pmQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].updateValueAndValidity();


        return this.pmQuoteFormGroup;
    }
    clearPMQuoteValidatorProposal(PMQuoteForm): FormGroup {
        let riskInfoArray: FormArray = <FormArray>this.pmQuoteFormGroup.controls['riskInfo'];
        riskInfoArray.at(0).get('vehicleEngineNo').setValidators(null);
        riskInfoArray.at(0).get('vehicleEngineNo').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleRegNo').setValidators(null);
        riskInfoArray.at(0).get('vehicleRegNo').updateValueAndValidity();
        riskInfoArray.at(0).get('vehicleChassisNo').setValidators(null);
        riskInfoArray.at(0).get('vehicleChassisNo').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['riskInfo'].updateValueAndValidity();
        if (this.pmQuoteFormGroup.controls['customerInfo'].get('policyHolderType').value === 'I') {
            this.pmQuoteFormGroup.controls['customerInfo'].get('prefix').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('prefix').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('appMName').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('appMName').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            // tslint:disable-next-line:max-line-length
            this.pmQuoteFormGroup.controls['customerInfo'].get('age').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            // tslint:disable-next-line:max-line-length
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(null);
            this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        }
        this.pmQuoteFormGroup.controls['customerInfo'].get('zipCd').setValidators(null);
        this.pmQuoteFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(null);
        this.pmQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(null);
        this.pmQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].updateValueAndValidity();


        return this.pmQuoteFormGroup;
    }
    setPMQuotSaveQuoteModalValidator(_insuredModalTravelQuotForm) {
        this.pmQuoteFormGroup = _insuredModalTravelQuotForm;
        this.pmQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        this.pmQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.required);
        this.pmQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.required);
        this.pmQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(15)]));
        this.pmQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
        this.pmQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(Validators.required);
        this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.required);
        this.pmQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        return this.pmQuoteFormGroup;
    }
    setPaymentValidationsForCheque(travelQuoteFormGrp) {
        this.pmQuoteFormGroup = travelQuoteFormGrp;
        this.pmQuoteFormGroup.controls['paymentInfo'].get('chequeNo').setValidators(Validators.required);
        this.pmQuoteFormGroup.controls['paymentInfo'].get('chequeDate').setValidators(Validators.required);
        this.pmQuoteFormGroup.controls['paymentInfo'].get('depositBank').setValidators(Validators.required);
        return this.pmQuoteFormGroup;
    }

    clearPaymentValidationsForCheque(travelQuoteFormGrp) {
        this.pmQuoteFormGroup = travelQuoteFormGrp;
        this.pmQuoteFormGroup.controls['paymentInfo'].clearValidators();
        return this.pmQuoteFormGroup;
    }
    setRequiredValidatorForSalesAgent(travelQuoteFormGrp) {
        this.pmQuoteFormGroup = travelQuoteFormGrp;
        this.pmQuoteFormGroup.controls['policyInfo'].get('agentCd').setValidators(Validators.compose([Validators.required]));
        this.pmQuoteFormGroup.controls['policyInfo'].get('agentCd').updateValueAndValidity();
    }
}
