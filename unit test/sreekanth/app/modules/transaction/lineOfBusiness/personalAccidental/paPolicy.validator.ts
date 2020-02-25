import { MinSizeValidator } from './../../../../core/ui-components/validators/minsize/minsize.validator';
import { FormArray } from '@angular/forms/src/model';
import { EmailIdvalidators } from '../../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../../core/ui-components/validators/minnumber/minnumber.validator';
import { FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '../../../../core/ui-components/validators/maxsize/maxsize.validator';

export class PersonalAccidentPolicyValidator {
    paQuoteFormGroup: FormGroup;
    setPAQuotValidatorBasicDetails(pAQuotForm: FormGroup, productCode?: string): FormGroup {
        this.paQuoteFormGroup = pAQuotForm;
        let riskInfoArray: FormArray = <FormArray>this.paQuoteFormGroup.controls['riskInfo'];
        riskInfoArray.at(0).get('occupationClassCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('occupationClassCode').updateValueAndValidity();
        riskInfoArray.at(0).get('occupationClassDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('occupationClassDesc').updateValueAndValidity();
        if (productCode === 'CPA') {
            riskInfoArray.at(0).get('excessDeductibleCode').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('excessDeductibleCode').updateValueAndValidity();
            riskInfoArray.at(0).get('excessDeductibleDesc').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('excessDeductibleDesc').updateValueAndValidity();
        }
        if (productCode === 'PAI') {
            riskInfoArray.at(0).get('DOB').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('DOB').updateValueAndValidity();
            riskInfoArray.at(0).get('appFName').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('appFName').updateValueAndValidity();
            let planArray: FormArray = <FormArray>riskInfoArray.at(0).get('plans');
            planArray.at(0).get('planTypeCode').setValidators(Validators.compose([Validators.required]));
            planArray.at(0).get('planTypeCode').updateValueAndValidity();
        }
        this.paQuoteFormGroup.controls['riskInfo'] = riskInfoArray;
        this.paQuoteFormGroup.controls['riskInfo'].updateValueAndValidity();
        this.paQuoteFormGroup.controls['policyInfo'].get('inceptionDt').setValidators(Validators.compose([Validators.required]));
        this.paQuoteFormGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
        this.paQuoteFormGroup.controls['policyInfo'].get('expiryDt').setValidators(Validators.compose([Validators.required]));
        this.paQuoteFormGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
        return this.paQuoteFormGroup;
    }
    clearPAQuotValidatorsBasicDetails(pAQuotForm): FormGroup {
        this.paQuoteFormGroup = pAQuotForm;
        this.paQuoteFormGroup.clearValidators();
        return this.paQuoteFormGroup;
    }
    setPAQuotCustomerInfoValidator(pAQuotForm): FormGroup {
        this.paQuoteFormGroup = pAQuotForm;
        this.paQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
        this.paQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('DOB').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([MaxSizeValidator.maxSize(6), Validators.required]));
        this.paQuoteFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').setValidators(Validators.compose([MaxSizeValidator.maxSize(10), Validators.required]));
        this.paQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('blockNumber').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([MaxSizeValidator.maxSize(14), Validators.required]));
        this.paQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.paQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        return this.paQuoteFormGroup;
    }
    clearPAQuotCustomerInfoValidator(insuredFormGroup: FormGroup) {
        this.paQuoteFormGroup = insuredFormGroup;
        this.paQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('zipCd').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('blockNumber').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('relationWithAppCode').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('relationWithAppCode').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(null);
        this.paQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].clearValidators();
        this.paQuoteFormGroup.controls['customerInfo'].updateValueAndValidity();
        return this.paQuoteFormGroup;
    }
    setPAQuotInsuredValidators(insuredFormGroup: FormGroup): FormGroup {
        insuredFormGroup.get('appFName').setValidators(Validators.required);
        insuredFormGroup.get('appFName').updateValueAndValidity();
        insuredFormGroup.get('appLName').setValidators(Validators.required);
        insuredFormGroup.get('appLName').updateValueAndValidity();
        insuredFormGroup.get('identityTypeCode').setValidators(Validators.required);
        insuredFormGroup.get('identityTypeCode').updateValueAndValidity();
        insuredFormGroup.get('identityTypeDesc').setValidators(Validators.required);
        insuredFormGroup.get('identityTypeDesc').updateValueAndValidity();
        insuredFormGroup.get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
        insuredFormGroup.get('identityNo').updateValueAndValidity();
        insuredFormGroup.get('appUnitNumber').setValidators(Validators.compose([MaxSizeValidator.maxSize(7), Validators.required]));
        insuredFormGroup.get('appUnitNumber').updateValueAndValidity();
        insuredFormGroup.get('mobilePh').setValidators(Validators.compose([MaxSizeValidator.maxSize(14), Validators.required]));
        insuredFormGroup.get('mobilePh').updateValueAndValidity();
        insuredFormGroup.get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        insuredFormGroup.get('emailId').updateValueAndValidity();
        insuredFormGroup.get('relationWithAppDesc').setValidators(Validators.required);
        insuredFormGroup.get('relationWithAppDesc').updateValueAndValidity();
        insuredFormGroup.get('DOB').setValidators(Validators.required);
        insuredFormGroup.get('DOB').updateValueAndValidity();
        let nomineeList: FormArray = <FormArray>insuredFormGroup.get('nomineeList');
        nomineeList.controls.forEach(element => {
            element = this.setPAQuotNomineeValidators(element);
        });
        // insuredFormGroup.get('relationshipToInsuredCode').setValidators(Validators.required);
        // insuredFormGroup.get('relationshipToInsuredCode').updateValueAndValidity();
        // insuredFormGroup.get('beneficiaryName').setValidators(Validators.required);
        // insuredFormGroup.get('beneficiaryName').updateValueAndValidity();
        // insuredFormGroup.get('relationWithAppCode').setValidators(Validators.required);
        // insuredFormGroup.get('relationWithAppCode').updateValueAndValidity();
        return insuredFormGroup;
    }
    clearSetInsuredValidators(insuredFormGroup: FormGroup): FormGroup {
        insuredFormGroup.get('appFName').setValidators(null);
        insuredFormGroup.get('appFName').updateValueAndValidity();
        insuredFormGroup.get('appLName').setValidators(null);
        insuredFormGroup.get('appLName').updateValueAndValidity();
        insuredFormGroup.get('identityTypeCode').setValidators(null);
        insuredFormGroup.get('identityTypeCode').updateValueAndValidity();
        insuredFormGroup.get('identityTypeDesc').setValidators(null);
        insuredFormGroup.get('identityTypeDesc').updateValueAndValidity();
        insuredFormGroup.get('identityNo').setValidators(null);
        insuredFormGroup.get('identityNo').updateValueAndValidity();
        insuredFormGroup.get('appUnitNumber').setValidators(null);
        insuredFormGroup.get('appUnitNumber').updateValueAndValidity();
        insuredFormGroup.get('mobilePh').setValidators(null);
        insuredFormGroup.get('mobilePh').updateValueAndValidity();
        insuredFormGroup.get('emailId').setValidators(null);
        insuredFormGroup.get('emailId').updateValueAndValidity();
        insuredFormGroup.get('relationWithAppDesc').setValidators(null);
        insuredFormGroup.get('relationWithAppDesc').updateValueAndValidity();
        insuredFormGroup.get('relationWithAppCode').setValidators(null);
        insuredFormGroup.get('relationWithAppCode').updateValueAndValidity();
        insuredFormGroup.get('DOB').setValidators(null);
        insuredFormGroup.get('DOB').updateValueAndValidity();
        insuredFormGroup.get('relationshipToInsuredCode').setValidators(null);
        insuredFormGroup.get('relationshipToInsuredCode').updateValueAndValidity();
        let nomineeList: FormArray = <FormArray>insuredFormGroup.get('nomineeList');
        nomineeList.controls.forEach(element => {
            element = this.clearQuotNomineeValidators(element);
        });
        insuredFormGroup.clearValidators();
        insuredFormGroup.updateValueAndValidity();
        return insuredFormGroup;
    }
    setPAQuotInsuredModalValidator(_insuredModalTravelQuotForm) {
        this.paQuoteFormGroup = _insuredModalTravelQuotForm;
        this.paQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        this.paQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(15)]));
        this.paQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
        this.paQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.required);
        this.paQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        return this.paQuoteFormGroup;
    }

    setPAQuotNomineeValidators(nomineeFormGroup: any) {
        nomineeFormGroup.get('appFName').setValidators(Validators.required);
        nomineeFormGroup.get('appFName').updateValueAndValidity();
        nomineeFormGroup.get('appLName').setValidators(Validators.required);
        nomineeFormGroup.get('appLName').updateValueAndValidity();
        nomineeFormGroup.get('identityTypeCode').setValidators(Validators.required);
        nomineeFormGroup.get('identityTypeCode').updateValueAndValidity();
        nomineeFormGroup.get('identityTypeDesc').setValidators(Validators.required);
        nomineeFormGroup.get('identityTypeDesc').updateValueAndValidity();
        nomineeFormGroup.get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
        nomineeFormGroup.get('identityNo').updateValueAndValidity();
        nomineeFormGroup.get('relationshipToInsuredCode').setValidators(Validators.required);
        nomineeFormGroup.get('relationshipToInsuredCode').updateValueAndValidity();
        nomineeFormGroup.get('nomineeShare').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(3)]));
        nomineeFormGroup.get('nomineeShare').updateValueAndValidity();
        return nomineeFormGroup;
    }
    clearQuotNomineeValidators(nomineeFormGroup: any) {
        nomineeFormGroup.get('appFName').setValidators(null);
        nomineeFormGroup.get('appFName').updateValueAndValidity();
        nomineeFormGroup.get('appLName').setValidators(null);
        nomineeFormGroup.get('appLName').updateValueAndValidity();
        nomineeFormGroup.get('identityTypeCode').setValidators(null);
        nomineeFormGroup.get('identityTypeCode').updateValueAndValidity();
        nomineeFormGroup.get('identityTypeDesc').setValidators(null);
        nomineeFormGroup.get('identityTypeDesc').updateValueAndValidity();
        nomineeFormGroup.get('identityNo').setValidators(null);
        nomineeFormGroup.get('identityNo').updateValueAndValidity();
        nomineeFormGroup.get('relationshipToInsuredCode').setValidators(null);
        nomineeFormGroup.get('relationshipToInsuredCode').updateValueAndValidity();
        nomineeFormGroup.get('nomineeShare').setValidators(null);
        nomineeFormGroup.get('nomineeShare').updateValueAndValidity();
        return nomineeFormGroup;
    }
    setPAIRiskValidator(riskGroup, doNomineeValidation:boolean = true,multiItemFlag:boolean=false) {
        riskGroup.get('DOB').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('DOB').updateValueAndValidity();
        riskGroup.get('appFName').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('appFName').updateValueAndValidity();
        riskGroup.get('occupationClassCode').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('occupationClassCode').updateValueAndValidity();
        riskGroup.get('occupationClassDesc').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('occupationClassDesc').updateValueAndValidity();
        let planArray: FormArray = <FormArray>riskGroup.get('plans');
        planArray.at(0).get('planTypeCode').setValidators(Validators.compose([Validators.required]));
        planArray.at(0).get('planTypeCode').updateValueAndValidity();
        if (doNomineeValidation) {
            let nomineeList: FormArray = <FormArray>riskGroup.get('nomineeList');
            nomineeList.controls.forEach(element => {
                element = this.setPAQuotNomineeValidators(element);
            });
        }
        return  riskGroup;
    }
    setRequiredValidatorForSalesAgent(paQuoteFormGroup) {
        this.paQuoteFormGroup = paQuoteFormGroup;
        this.paQuoteFormGroup.controls['policyInfo'].get('agentCd').setValidators(Validators.compose([Validators.required]));
        this.paQuoteFormGroup.controls['policyInfo'].get('agentCd').updateValueAndValidity();
    }

    setEmailQuoteModalValidator(_emailModalTravelQuotForm) {
        this.paQuoteFormGroup = _emailModalTravelQuotForm;
        this.paQuoteFormGroup.controls['emailQuotInfo'].get('toAddress').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.paQuoteFormGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        return this.paQuoteFormGroup;
    }
}