import { MinSizeValidator } from './../../../../../core/ui-components/validators/minsize/minsize.validator';
import { FormArray } from '@angular/forms/src/model';
import { EmailIdvalidators } from '../../../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../../../core/ui-components/validators/minnumber/minnumber.validator';
import { FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '../../../../../core/ui-components/validators/maxsize/maxsize.validator';

export class FireHomeQuoteValidator {
    fhQuoteFormGroup: FormGroup;
    setFHQuoteValidatorBasicDetails(FHQuoteForm: FormGroup, productCode?: string): FormGroup {
        this.fhQuoteFormGroup = FHQuoteForm;
        let riskInfoArray: FormArray = <FormArray>this.fhQuoteFormGroup.controls['riskInfo'];
        if (productCode === '200') {
            riskInfoArray.at(0).get('displayPlanTypeCode').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('displayPlanTypeCode').updateValueAndValidity();
            riskInfoArray.at(0).get('displayPlanTypeDesc').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('displayPlanTypeDesc').updateValueAndValidity();
        }
        else {
            riskInfoArray.at(0).get('displayPlanTypeCode').setValidators(null);
            riskInfoArray.at(0).get('displayPlanTypeCode').updateValueAndValidity();
            riskInfoArray.at(0).get('displayPlanTypeDesc').setValidators(null);
            riskInfoArray.at(0).get('displayPlanTypeDesc').updateValueAndValidity();
        }
        riskInfoArray.at(0).get('occupationCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('occupationCode').updateValueAndValidity();
        riskInfoArray.at(0).get('occupationDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('occupationDesc').updateValueAndValidity();
        riskInfoArray.at(0).get('buildingTypeCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('buildingTypeCode').updateValueAndValidity();
        riskInfoArray.at(0).get('buildingTypeDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('buildingTypeDesc').updateValueAndValidity();
        riskInfoArray.at(0).get('ownershipCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('ownershipCode').updateValueAndValidity();
        riskInfoArray.at(0).get('ownershipDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('ownershipDesc').updateValueAndValidity();
        riskInfoArray.at(0).get('occupationCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('occupationCode').updateValueAndValidity();
        riskInfoArray.at(0).get('occupationDesc').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('occupationDesc').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['riskInfo'] = riskInfoArray;
        this.fhQuoteFormGroup.controls['riskInfo'].updateValueAndValidity();
        this.fhQuoteFormGroup.controls['policyInfo'].get('inceptionDt').setValidators(Validators.compose([Validators.required]));
        this.fhQuoteFormGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['policyInfo'].get('expiryDt').setValidators(Validators.compose([Validators.required]));
        this.fhQuoteFormGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['policyInfo'].updateValueAndValidity();
        return this.fhQuoteFormGroup;
    }
    clearFHQuotValidatorsBasicDetails(pAQuotForm): FormGroup {
        this.fhQuoteFormGroup = pAQuotForm;
        this.fhQuoteFormGroup.clearValidators();
        return this.fhQuoteFormGroup;
    }
    setFHQuoteCustomerInfoValidator(FHQuoteForm): FormGroup {
        this.fhQuoteFormGroup = FHQuoteForm;
        this.fhQuoteFormGroup.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([MaxSizeValidator.maxSize(6), Validators.required]));
        this.fhQuoteFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').setValidators(Validators.compose([MaxSizeValidator.maxSize(10), Validators.required]));
        this.fhQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('blockNumber').setValidators(Validators.required);
        this.fhQuoteFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required, MinSizeValidator.minSize(9), MaxSizeValidator.maxSize(14)]));
        this.fhQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.fhQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        if (this.fhQuoteFormGroup.controls['customerInfo'].get('policyHolderType').value === 'O') {
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyRegNumber').setValidators(Validators.compose([Validators.required]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationCode').setValidators(Validators.compose([Validators.required]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationDesc').setValidators(Validators.compose([Validators.required]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();

            this.fhQuoteFormGroup.controls['customerInfo'].get('prefix').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('prefix').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('appFName').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appMName').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('appMName').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appMName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('appLName').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('age').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('age').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('DOB').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();

        } else {
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyName').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyName').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyRegNumber').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyRegNumber').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationCode').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationCode').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationDesc').setValidators(null);
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationDesc').reset();
            this.fhQuoteFormGroup.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();

            this.fhQuoteFormGroup.controls['customerInfo'].get('prefix').setValidators(Validators.required);
            this.fhQuoteFormGroup.controls['customerInfo'].get('prefix').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30), Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+')]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appMName').setValidators(Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+'));
            this.fhQuoteFormGroup.controls['customerInfo'].get('appMName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30), Validators.pattern('([a-zA-Z\'?]{1,30}\s*)+')]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('DOB').setValidators(Validators.compose([Validators.required]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('age').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(18)]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.required);
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(Validators.required);
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
            this.fhQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();

        }
        return this.fhQuoteFormGroup;
    }
    setReferQuoteModalValidator(_referQuoteModalForm) {
        this.fhQuoteFormGroup = _referQuoteModalForm;
        this.fhQuoteFormGroup.controls['referQuotInfo'].get('referTo').setValidators(Validators.compose([EmailIdvalidators.multiplemailFormat(','), Validators.required]));
        this.fhQuoteFormGroup.controls['referQuotInfo'].get('referTo').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['referQuotInfo'].get('ccAddress').setValidators(Validators.compose([EmailIdvalidators.multiplemailFormat(',')]));
        this.fhQuoteFormGroup.controls['referQuotInfo'].get('ccAddress').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['referQuotInfo'].get('referralRemarks').setValidators(Validators.compose([Validators.required]));
        this.fhQuoteFormGroup.controls['referQuotInfo'].get('referralRemarks').updateValueAndValidity();
        return this.fhQuoteFormGroup;
    }
    clearFHQuoteCustomerInfoValidator(insuredFormGroup: FormGroup) {
        this.fhQuoteFormGroup = insuredFormGroup;
        this.fhQuoteFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('appMName').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('appMName').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('zipCd').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('blockNumber').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('mobilePh').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].get('emailId').setValidators(null);
        this.fhQuoteFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.fhQuoteFormGroup.controls['customerInfo'].clearValidators();
        this.fhQuoteFormGroup.controls['customerInfo'].updateValueAndValidity();
        return this.fhQuoteFormGroup;
    }
    setPaymentValidationsForCheque(travelQuoteFormGrp) {
        this.fhQuoteFormGroup = travelQuoteFormGrp;
        this.fhQuoteFormGroup.controls['paymentInfo'].get('chequeNo').setValidators(Validators.required);
        this.fhQuoteFormGroup.controls['paymentInfo'].get('chequeDate').setValidators(Validators.required);
        this.fhQuoteFormGroup.controls['paymentInfo'].get('depositBank').setValidators(Validators.required);
        return this.fhQuoteFormGroup;
    }

    clearPaymentValidationsForCheque(travelQuoteFormGrp) {
        this.fhQuoteFormGroup = travelQuoteFormGrp;
        this.fhQuoteFormGroup.controls['paymentInfo'].clearValidators();
        return this.fhQuoteFormGroup;
    }
    setRequiredValidatorForSalesAgent(travelQuoteFormGrp) {
        this.fhQuoteFormGroup = travelQuoteFormGrp;
        this.fhQuoteFormGroup.controls['policyInfo'].get('agentCd').setValidators(Validators.compose([Validators.required]));
        this.fhQuoteFormGroup.controls['policyInfo'].get('agentCd').updateValueAndValidity();
    }
    public setFHRiskValidator(riskGroup) {
        return riskGroup;
    }
    setQuoteRiskValidators(riskGroup) {
        riskGroup.get('occupationCode').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('occupationCode').updateValueAndValidity();
        riskGroup.get('occupationDesc').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('occupationDesc').updateValueAndValidity();
        riskGroup.get('buildingTypeCode').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('buildingTypeCode').updateValueAndValidity();
        riskGroup.get('buildingTypeDesc').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('buildingTypeDesc').updateValueAndValidity();
        riskGroup.get('ownershipCode').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('ownershipCode').updateValueAndValidity();
        riskGroup.get('ownershipDesc').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('ownershipDesc').updateValueAndValidity();
        let planArray: FormArray = <FormArray>riskGroup.get('plans');
        planArray.at(0).get('planTypeCode').setValidators(Validators.compose([Validators.required]));
        planArray.at(0).get('planTypeCode').updateValueAndValidity();
        return riskGroup;
    }
    setFHQuoteValidatorBasicForMultiItem(FHQuoteForm: FormGroup) {
        let riskInfoArray: FormArray = <FormArray>FHQuoteForm.controls['riskInfo'];
        for (let riskIndex = 0; riskIndex < riskInfoArray.length; riskIndex++) {
            riskInfoArray.at(riskIndex).get('occupationCode').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(riskIndex).get('occupationCode').updateValueAndValidity();
            riskInfoArray.at(riskIndex).get('occupationDesc').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(riskIndex).get('occupationDesc').updateValueAndValidity();
            riskInfoArray.at(riskIndex).get('buildingTypeCode').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(riskIndex).get('buildingTypeCode').updateValueAndValidity();
            riskInfoArray.at(riskIndex).get('buildingTypeDesc').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(riskIndex).get('buildingTypeDesc').updateValueAndValidity();
            riskInfoArray.at(riskIndex).get('ownershipCode').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(riskIndex).get('ownershipCode').updateValueAndValidity();
            riskInfoArray.at(riskIndex).get('ownershipDesc').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(riskIndex).get('ownershipDesc').updateValueAndValidity();
            FHQuoteForm.controls['riskInfo'] = riskInfoArray;
            FHQuoteForm.controls['riskInfo'].updateValueAndValidity();
        }
        return this.fhQuoteFormGroup;
    }
}
