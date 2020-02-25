import { MinSizeValidator } from './../../../../core/ui-components/validators/minsize/minsize.validator';
import { FormArray } from '@angular/forms/src/model';
import { EmailIdvalidators } from '../../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../../core/ui-components/validators/minnumber/minnumber.validator';
import { FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '../../../../core/ui-components/validators/maxsize/maxsize.validator';

export class TravelPolicyValidator {
    travelQuotForm: FormGroup;
    insuredTravelQuotForm: FormGroup;

    travellerTypeCodeIndividual = 'IND';
    setTravelQuotValidator(travelQuotForm) {
        this.travelQuotForm = travelQuotForm;
        this.travelQuotForm.controls['policyInfo'].get('policyTerm').setValidators(Validators.compose([Validators.required]));
        let riskInfoArray: FormArray = <FormArray>this.travelQuotForm.controls['riskInfo'];
        let countryTravelListArray: FormArray = <FormArray>riskInfoArray.at(0).get('countryTravelList');
        if (this.travelQuotForm.controls['policyInfo'].value.policyTerm === '07') {
            countryTravelListArray.at(0).get('travellingToCode').setValidators(Validators.compose([Validators.required]));
            countryTravelListArray.at(0).get('travellingToCode').updateValueAndValidity();           
            // riskInfoArray.at(0).get('travellingTo').setValidators(Validators.compose([Validators.required]));
            // riskInfoArray.at(0).get('travellingTo').updateValueAndValidity();
            this.travelQuotForm.controls['policyInfo'].get('inceptionDt').setValidators(Validators.compose([Validators.required]));
            this.travelQuotForm.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
            this.travelQuotForm.controls['policyInfo'].get('expiryDt').setValidators(Validators.compose([Validators.required]));
            this.travelQuotForm.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').setValidators(Validators.compose([MaxNumberValidator.maxNumber(180), MinNumberValidator.minNumber(1), Validators.maxLength(3)]));
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            riskInfoArray.at(0).get('regionCode').setValidators(Validators.compose(null));
            // riskInfoArray.at(0).get('regionCode').reset();
            riskInfoArray.at(0).get('regionCode').updateValueAndValidity();

            if (riskInfoArray.at(0).value.travellerTypeCode !== this.travellerTypeCodeIndividual) {
                riskInfoArray.at(0).get('numberofAdults').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(1), MaxNumberValidator.maxNumber(20), Validators.maxLength(2)]));
                riskInfoArray.at(0).get('numberofAdults').updateValueAndValidity();


                riskInfoArray.at(0).get('numberofChildren').setValidators(Validators.compose([MaxNumberValidator.maxNumber(20), Validators.maxLength(2)]));
                riskInfoArray.at(0).get('numberofChildren').updateValueAndValidity();

                riskInfoArray.at(0).get('numberofTravellers').setValidators(Validators.compose([MinNumberValidator.minNumber(2), MaxNumberValidator.maxNumber(20)]));
                riskInfoArray.at(0).get('numberofTravellers').updateValueAndValidity();
            } else {
                riskInfoArray.at(0).get('numberofAdults').setValidators(Validators.compose(null));
                riskInfoArray.at(0).get('numberofAdults').reset();
                riskInfoArray.at(0).get('numberofAdults').updateValueAndValidity();

                riskInfoArray.at(0).get('numberofChildren').setValidators(Validators.compose(null));
                riskInfoArray.at(0).get('numberofChildren').reset();
                riskInfoArray.at(0).get('numberofChildren').updateValueAndValidity();

                riskInfoArray.at(0).get('numberofTravellers').setValidators(Validators.compose(null));
                riskInfoArray.at(0).get('numberofTravellers').reset();
                riskInfoArray.at(0).get('numberofTravellers').updateValueAndValidity();

            }
        } else if (this.travelQuotForm.controls['policyInfo'].value.policyTerm === '01') {
            countryTravelListArray.at(0).get('travellingToCode').setValidators(null);
            countryTravelListArray.at(0).get('travellingToCode').reset();
            countryTravelListArray.at(0).get('travellingToCode').updateValueAndValidity();
            // riskInfoArray.at(0).get('travellingTo').setValidators(null);
            // riskInfoArray.at(0).get('travellingTo').reset();
            // riskInfoArray.at(0).get('travellingTo').updateValueAndValidity();
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').setValidators(Validators.compose(null));
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').reset();
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            riskInfoArray.at(0).get('regionCode').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('regionCode').updateValueAndValidity();
            riskInfoArray.at(0).get('regionDesc').setValidators(Validators.compose([Validators.required]));
            riskInfoArray.at(0).get('regionDesc').updateValueAndValidity();
            if (riskInfoArray.at(0).value.travellerTypeCode !== this.travellerTypeCodeIndividual) {
                riskInfoArray.at(0).get('numberofAdults').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(1), MaxNumberValidator.maxNumber(20), Validators.minLength(1), Validators.maxLength(2)]));
                riskInfoArray.at(0).get('numberofAdults').updateValueAndValidity();

                riskInfoArray.at(0).get('numberofChildren').setValidators(Validators.compose([MaxNumberValidator.maxNumber(20), Validators.maxLength(2)]));
                riskInfoArray.at(0).get('numberofChildren').updateValueAndValidity();

                riskInfoArray.at(0).get('numberofTravellers').setValidators(Validators.compose([MinNumberValidator.minNumber(2), MaxNumberValidator.maxNumber(20)]));
                riskInfoArray.at(0).get('numberofTravellers').updateValueAndValidity();

            } else {
                riskInfoArray.at(0).get('numberofAdults').setValidators(Validators.compose(null));
                riskInfoArray.at(0).get('numberofAdults').updateValueAndValidity();

                riskInfoArray.at(0).get('numberofChildren').setValidators(Validators.compose(null));
                riskInfoArray.at(0).get('numberofChildren').updateValueAndValidity();

                riskInfoArray.at(0).get('numberofTravellers').setValidators(Validators.compose(null));
                riskInfoArray.at(0).get('numberofTravellers').updateValueAndValidity();

            }
        }
        this.travelQuotForm.controls['riskInfo'] = riskInfoArray;
        this.travelQuotForm.controls['riskInfo'].updateValueAndValidity();
        return this.travelQuotForm;
    }
    clearTravelQuotValidators(_insuredTravelQuotForm) {
        this.insuredTravelQuotForm = _insuredTravelQuotForm;
        this.insuredTravelQuotForm.clearValidators();
        return this.insuredTravelQuotForm;
    }
    setTravelQuotInsuredValidator(_insuredTravelQuotForm) {
        this.insuredTravelQuotForm = _insuredTravelQuotForm;
        this.insuredTravelQuotForm.controls['customerInfo'].get('policyHolderType').setValidators(Validators.compose([Validators.required]));
        this.insuredTravelQuotForm.controls['customerInfo'].get('policyHolderType').updateValueAndValidity();
        let riskInfoArray: FormArray = <FormArray>this.insuredTravelQuotForm.controls['riskInfo'];
        let insuredArray: FormArray = <FormArray>riskInfoArray.at(0).get('insuredList');
        insuredArray.at(0).get('appFName').setValidators(Validators.required);
        insuredArray.at(0).get('appFName').updateValueAndValidity();
        insuredArray.at(0).get('appLName').setValidators(Validators.required);
        insuredArray.at(0).get('appLName').updateValueAndValidity();
        insuredArray.at(0).get('DOB').setValidators(Validators.required);
        insuredArray.at(0).get('DOB').updateValueAndValidity();
        insuredArray.at(0).get('age').setValidators(Validators.required);
        insuredArray.at(0).get('age').updateValueAndValidity();
        // insuredArray.at(0).get('hkidOrPassport').setValidators(Validators.required);
        // insuredArray.at(0).get('hkidOrPassport').updateValueAndValidity();
        insuredArray.at(0).get('identityTypeCode').setValidators(Validators.required);
        insuredArray.at(0).get('identityTypeCode').updateValueAndValidity();
        insuredArray.at(0).get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
        insuredArray.at(0).get('identityNo').updateValueAndValidity();
        if(_insuredTravelQuotForm.controls['customerInfo'].get('policyHolderType').value === 'I'){
        insuredArray.at(0).get('relationWithAppCode').setValidators(Validators.required);
        insuredArray.at(0).get('relationWithAppCode').updateValueAndValidity();
        }
        this.insuredTravelQuotForm.controls['riskInfo'] = riskInfoArray;
        this.insuredTravelQuotForm.updateValueAndValidity();
        if (this.insuredTravelQuotForm.controls['customerInfo'].get('policyHolderType').value === 'O') {
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyRegNumber').setValidators(Validators.compose([Validators.required]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationCode').setValidators(Validators.compose([Validators.required]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationDesc').setValidators(Validators.compose([Validators.required]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('prefix').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('prefix').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('age').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('age').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('age').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('DOB').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('DOB').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeCode').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeDesc').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityNo').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('isPassport').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('isPassport').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('isPassport').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('isPolicyHolderInsured').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('isPolicyHolderInsured').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('isPolicyHolderInsured').updateValueAndValidity();
        } else {
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyName').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyName').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyRegNumber').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyRegNumber').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationCode').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationCode').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationDesc').setValidators(null);
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationDesc').reset();
            this.insuredTravelQuotForm.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();

            this.insuredTravelQuotForm.controls['customerInfo'].get('prefix').setValidators(Validators.required);
            this.insuredTravelQuotForm.controls['customerInfo'].get('prefix').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(30)]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('DOB').setValidators(Validators.compose([Validators.required]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('DOB').updateValueAndValidity();
            // tslint:disable-next-line:max-line-length
            this.insuredTravelQuotForm.controls['customerInfo'].get('age').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(18)]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('age').updateValueAndValidity();
            // tslint:disable-next-line:max-line-length
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.required);
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeDesc').setValidators(Validators.required);
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([MaxSizeValidator.maxSize(20), Validators.required]));
            this.insuredTravelQuotForm.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            // this.insuredTravelQuotForm.controls['customerInfo'].get('isPassport').setValidators(Validators.required);
            // this.insuredTravelQuotForm.controls['customerInfo'].get('isPassport').updateValueAndValidity();
        }
        this.insuredTravelQuotForm.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(6)]));
        this.insuredTravelQuotForm.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required, MinSizeValidator.minSize(9), MaxSizeValidator.maxSize(20)]));
        this.insuredTravelQuotForm.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.insuredTravelQuotForm.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].updateValueAndValidity();
        return this.insuredTravelQuotForm;
    }
    setTravelQuotInsuredModalValidator(_insuredModalTravelQuotForm) {
        this.insuredTravelQuotForm = _insuredModalTravelQuotForm;
        this.insuredTravelQuotForm.controls['customerInfo'].get('emailId').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        this.insuredTravelQuotForm.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').setValidators(Validators.required);
        this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').setValidators(Validators.required);
        this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required, MinSizeValidator.minSize(9), MaxSizeValidator.maxSize(15)]));
        this.insuredTravelQuotForm.controls['customerInfo'].get('mobilePh').updateValueAndValidity();

        return this.insuredTravelQuotForm;
    }
    setEmailQuoteModalValidator(_emailModalTravelQuotForm) {
        this.travelQuotForm = _emailModalTravelQuotForm;
        this.travelQuotForm.controls['emailQuotInfo'].get('toAddress').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.travelQuotForm.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        return this.travelQuotForm;
    }
    setInsuredValidators(travelQuoteForm, insuredFormGroup: FormGroup) {
        insuredFormGroup.get('appFName').setValidators(Validators.required);
        insuredFormGroup.get('appLName').setValidators(Validators.required);
        insuredFormGroup.get('identityNo').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(20)]));
        insuredFormGroup.get('identityTypeCode').setValidators(Validators.required);
        insuredFormGroup.get('DOB').setValidators(Validators.required);
        insuredFormGroup.get('age').setValidators([Validators.required]);
        if(travelQuoteForm.controls['customerInfo'].get('policyHolderType').value === 'I'){
        insuredFormGroup.get('relationWithAppCode').setValidators(Validators.required);
        }
        return insuredFormGroup;
    }

    setReferQuotemodalValidators(referQuoteFormGroup) {
        referQuoteFormGroup.controls['referQuotInfo'].get('referralRemarks').setValidators(Validators.maxLength(200));
        return referQuoteFormGroup;
    }
    clearValidator(clearTravelFormGroup: FormGroup) {
        this.insuredTravelQuotForm = clearTravelFormGroup;
        this.insuredTravelQuotForm.controls['customerInfo'].get('companyName').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('companyName').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('age').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('age').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('DOB').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('zipCd').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('address1').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('address1').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('address2').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('address2').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('emailId').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('cityCode').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('cityCode').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('cityDesc').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('countryCode').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('countryCode').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('countryDesc').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
        //  this.insuredTravelQuotForm.controls['customerInfo'].get('mobilePh').reset();
        //  this.insuredTravelQuotForm.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('occupationCode').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('occupationDesc').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();
        this.insuredTravelQuotForm.controls['customerInfo'].get('companyRegNumber').reset();
        this.insuredTravelQuotForm.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();


        return this.insuredTravelQuotForm;
    }
    clearSetInsuredValidators(insuredFormGroup: FormGroup) {
        insuredFormGroup.get('appFName').setValidators(null);
        insuredFormGroup.get('appFName').updateValueAndValidity();
        insuredFormGroup.get('appLName').setValidators(null);
        insuredFormGroup.get('appLName').updateValueAndValidity();
        insuredFormGroup.get('DOB').setValidators(null);
        insuredFormGroup.get('DOB').updateValueAndValidity();
        insuredFormGroup.get('age').setValidators(null);
        insuredFormGroup.get('age').updateValueAndValidity();
        insuredFormGroup.get('relationWithAppCode').setValidators(null);
        insuredFormGroup.get('relationWithAppCode').updateValueAndValidity();
        // insuredFormGroup.get('hkidOrPassport').setValidators(null);
        // insuredFormGroup.get('hkidOrPassport').updateValueAndValidity();
        // insuredFormGroup.get('isPassport').setValidators(null);
        // insuredFormGroup.get('isPassport').updateValueAndValidity();
        insuredFormGroup.get('identityTypeCode').setValidators(null);
        insuredFormGroup.get('identityTypeCode').updateValueAndValidity();
        insuredFormGroup.get('identityTypeDesc').setValidators(null);
        insuredFormGroup.get('identityTypeDesc').updateValueAndValidity();
        insuredFormGroup.get('identityNo').setValidators(null);
        insuredFormGroup.get('identityNo').updateValueAndValidity();
        insuredFormGroup.clearValidators();
        insuredFormGroup.updateValueAndValidity();
        return insuredFormGroup;
    }
    setPaymentValidationsForCheque(travelQuoteFormGrp) {
        this.insuredTravelQuotForm = travelQuoteFormGrp;
        this.insuredTravelQuotForm.controls['paymentInfo'].get('chequeNo').setValidators(Validators.required);
        this.insuredTravelQuotForm.controls['paymentInfo'].get('chequeDate').setValidators(Validators.required);
        this.insuredTravelQuotForm.controls['paymentInfo'].get('depositBank').setValidators(Validators.required);
        return this.insuredTravelQuotForm;
    }

    clearPaymentValidationsForCheque(travelQuoteFormGrp) {
        this.insuredTravelQuotForm = travelQuoteFormGrp;
        this.insuredTravelQuotForm.controls['paymentInfo'].clearValidators();
        return this.insuredTravelQuotForm;
    }
    setQuoteRiskValidators(riskGroup,multiItemFlag:boolean=false) {
        riskGroup.get('regionCode').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('regionCode').updateValueAndValidity();
        riskGroup.get('regionDesc').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('regionDesc').updateValueAndValidity();
        riskGroup.get('numOfInsured').setValidators(Validators.compose([Validators.required]));
        riskGroup.get('numOfInsured').updateValueAndValidity();
        // if (this.travelQuotForm.controls['customerInfo'].get('policyHolderType').value === 'O') {
        //     riskGroup.get('occupationClassCode').setValidators(Validators.compose(null));
        //     riskGroup.get('occupationClassCode').reset();
        //     riskGroup.get('occupationClassCode').updateValueAndValidity();
        //     riskGroup.get('occupationClassDesc').setValidators(Validators.compose(null));
        //     riskGroup.get('occupationClassDesc').reset();
        //     riskGroup.get('occupationClassDesc').updateValueAndValidity();
        //     riskGroup.get('designationCode').setValidators(Validators.compose([Validators.required]));
        //     riskGroup.get('designationCode').updateValueAndValidity();
        //     riskGroup.get('designationDesc').setValidators(Validators.compose([Validators.required]));
        //     riskGroup.get('designationDesc').updateValueAndValidity();
        // } else {
        //     riskGroup.get('designationCode').setValidators(Validators.compose(null));
        //     riskGroup.get('designationCode').reset();
        //     riskGroup.get('designationCode').updateValueAndValidity();
        //     riskGroup.get('designationDesc').setValidators(Validators.compose(null));
        //     riskGroup.get('designationDesc').reset();
        //     riskGroup.get('designationDesc').updateValueAndValidity();
        //     riskGroup.get('occupationClassCode').setValidators(Validators.compose([Validators.required]));
        //     riskGroup.get('occupationClassCode').updateValueAndValidity();
        //     riskGroup.get('occupationClassDesc').setValidators(Validators.compose([Validators.required]));
        //     riskGroup.get('occupationClassDesc').updateValueAndValidity();
        // }
        let planArray: FormArray = <FormArray>riskGroup.get('plans');
        planArray.at(0).get('planTypeCode').setValidators(Validators.compose([Validators.required]));
        planArray.at(0).get('planTypeCode').updateValueAndValidity();
        return riskGroup;
    }

    setTravelGroupQuoteValidator(travelQuotForm) {
        this.travelQuotForm = travelQuotForm;
        this.travelQuotForm.controls['policyInfo'].get('policyTerm').setValidators(Validators.compose([Validators.required]));
        this.travelQuotForm.controls['customerInfo'].get('policyHolderType').setValidators(Validators.compose([Validators.required]));
        let riskInfoArray: FormArray = <FormArray>this.travelQuotForm.controls['riskInfo'];
        riskInfoArray.at(0).get('regionCode').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('regionCode').updateValueAndValidity();
        riskInfoArray.at(0).get('numOfInsured').setValidators(Validators.compose([Validators.required]));
        riskInfoArray.at(0).get('numOfInsured').updateValueAndValidity();
        let planArray: FormArray = <FormArray>riskInfoArray.at(0).get('plans');
        planArray.at(0).get('planTypeCode').setValidators(Validators.compose([Validators.required]));
        planArray.at(0).get('planTypeCode').updateValueAndValidity();
        this.travelQuotForm.controls['policyInfo'].get('inceptionDt').setValidators(Validators.compose([Validators.required]));
        this.travelQuotForm.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
        this.travelQuotForm.controls['policyInfo'].get('expiryDt').setValidators(Validators.compose([Validators.required]));
        this.travelQuotForm.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
        if (this.travelQuotForm.controls['policyInfo'].value.policyTerm === '07') {
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').setValidators(Validators.compose([MaxNumberValidator.maxNumber(180), MinNumberValidator.minNumber(1), Validators.maxLength(3)]));
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
        } else if (this.travelQuotForm.controls['policyInfo'].value.policyTerm === '01') {
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').setValidators(null);
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').reset();
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
        }
        // if (this.travelQuotForm.controls['customerInfo'].get('policyHolderType').value === 'O') {
        //     riskInfoArray.at(0).get('occupationClassCode').setValidators(null);
        //     riskInfoArray.at(0).get('occupationClassCode').reset();
        //     riskInfoArray.at(0).get('occupationClassCode').updateValueAndValidity();
        //     riskInfoArray.at(0).get('occupationClassDesc').setValidators(null);
        //     riskInfoArray.at(0).get('occupationClassDesc').reset();
        //     riskInfoArray.at(0).get('occupationClassDesc').updateValueAndValidity();
        //     riskInfoArray.at(0).get('designationCode').setValidators(Validators.compose([Validators.required]));
        //     riskInfoArray.at(0).get('designationCode').updateValueAndValidity();
        //     riskInfoArray.at(0).get('designationDesc').setValidators(Validators.compose([Validators.required]));
        //     riskInfoArray.at(0).get('designationDesc').updateValueAndValidity();
        // } else {
        //     riskInfoArray.at(0).get('designationCode').setValidators(null);
        //     riskInfoArray.at(0).get('designationCode').reset();
        //     riskInfoArray.at(0).get('designationCode').updateValueAndValidity();
        //     riskInfoArray.at(0).get('designationDesc').setValidators(null);
        //     riskInfoArray.at(0).get('designationDesc').reset();
        //     riskInfoArray.at(0).get('designationDesc').updateValueAndValidity();
        //     riskInfoArray.at(0).get('occupationClassCode').setValidators(Validators.compose([Validators.required]));
        //     riskInfoArray.at(0).get('occupationClassCode').updateValueAndValidity();
        //     riskInfoArray.at(0).get('occupationClassDesc').setValidators(Validators.compose([Validators.required]));
        //     riskInfoArray.at(0).get('occupationClassDesc').updateValueAndValidity();
        // }
        this.travelQuotForm.controls['riskInfo'] = riskInfoArray;
        this.travelQuotForm.controls['riskInfo'].updateValueAndValidity();
        return this.travelQuotForm;
    }
    setInsuredWithNomineeValidators(travelQuoteForm, insuredFormGroup: FormGroup) {
        insuredFormGroup.get('appFName').setValidators(Validators.required);
        insuredFormGroup.get('appFName').updateValueAndValidity();
        insuredFormGroup.get('appLName').setValidators(Validators.required);
        insuredFormGroup.get('appLName').updateValueAndValidity();
        insuredFormGroup.get('identityNo').setValidators(Validators.compose([Validators.required, MaxSizeValidator.maxSize(20)]));
        insuredFormGroup.get('identityNo').updateValueAndValidity();
        insuredFormGroup.get('identityTypeCode').setValidators(Validators.required);
        insuredFormGroup.get('identityTypeCode').updateValueAndValidity();
        insuredFormGroup.get('DOB').setValidators(Validators.required);
        insuredFormGroup.get('DOB').updateValueAndValidity();
        insuredFormGroup.get('age').setValidators([Validators.required]);
        insuredFormGroup.get('age').updateValueAndValidity();
        if(travelQuoteForm.controls['customerInfo'].get('policyHolderType').value === 'I'){
        insuredFormGroup.get('relationWithAppCode').setValidators(Validators.required);
        insuredFormGroup.get('relationWithAppCode').updateValueAndValidity();
        }
        let nomineeList: FormArray = <FormArray>insuredFormGroup.get('nomineeList');
        nomineeList.controls.forEach(element => {
            element = this.setNomineeValidators(element);
        });
        return insuredFormGroup;

    }
    clearInsuredWithNomineeValidators(insuredFormGroup: FormGroup) {
        insuredFormGroup.get('appFName').setValidators(null);
        insuredFormGroup.get('appFName').updateValueAndValidity();
        insuredFormGroup.get('appLName').setValidators(null);
        insuredFormGroup.get('appLName').updateValueAndValidity();
        insuredFormGroup.get('identityNo').setValidators(null);
        insuredFormGroup.get('identityNo').updateValueAndValidity();
        insuredFormGroup.get('identityTypeCode').setValidators(null);
        insuredFormGroup.get('identityTypeCode').updateValueAndValidity();
        insuredFormGroup.get('DOB').setValidators(null);
        insuredFormGroup.get('DOB').updateValueAndValidity();
        insuredFormGroup.get('age').setValidators(null);
        insuredFormGroup.get('age').updateValueAndValidity();
        insuredFormGroup.get('relationWithAppCode').setValidators(null);
        insuredFormGroup.get('relationWithAppCode').updateValueAndValidity();
        let nomineeList: FormArray = <FormArray>insuredFormGroup.get('nomineeList');
        nomineeList.controls.forEach(element => {
            element = this.clearQuotNomineeValidators(element);
        });
        return insuredFormGroup;

    }
    setNomineeValidators(nomineeFormGroup: any) {
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
    setRequiredValidatorForSalesAgent(travelQuotForm) {
        this.travelQuotForm = travelQuotForm;
        this.travelQuotForm.controls['policyInfo'].get('agentCd').setValidators(Validators.compose([Validators.required]));
        this.travelQuotForm.controls['policyInfo'].get('agentCd').updateValueAndValidity();
    }
    doSetUnsetTravellerValidation(tempRiskFormGroup, doSetValidations) {
        if (doSetValidations) {
            tempRiskFormGroup.get('numberofAdults').setValue(null);
            tempRiskFormGroup.get('numberofAdults').setValidators(null);
            tempRiskFormGroup.get('numberofAdults').updateValueAndValidity();
            tempRiskFormGroup.get('numberofChildren').setValue(null);
            tempRiskFormGroup.get('numberofChildren').setValidators(null);
            tempRiskFormGroup.get('numberofChildren').updateValueAndValidity();
        } else {
            tempRiskFormGroup.get('numberofAdults').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(1), MaxNumberValidator.maxNumber(20), Validators.maxLength(2)]));
            tempRiskFormGroup.get('numberofAdults').updateValueAndValidity();
            tempRiskFormGroup.get('numberofChildren').setValidators(Validators.compose([MaxNumberValidator.maxNumber(20), Validators.maxLength(2)]));
            tempRiskFormGroup.get('numberofChildren').updateValueAndValidity();
        }
    }
}