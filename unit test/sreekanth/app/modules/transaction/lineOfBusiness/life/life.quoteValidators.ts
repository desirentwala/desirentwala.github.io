import { FormArray, FormGroup, Validators } from '@angular/forms';
import { EmailIdvalidators } from '../../../../core/ui-components/validators/emailid/emailid.validator';
import { MinNumberValidator } from './../../../../core/ui-components/validators/minnumber/minnumber.validator';
export class LifeQuoteValidator {
    quotFormGroup: FormGroup;
    setBasicDetailsValidator(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
        this.quotFormGroup = this.clearCustomerInfoValidation(this.quotFormGroup);
        this.quotFormGroup = this.clearInsuredInfoValidation(this.quotFormGroup);
        this.quotFormGroup = this.clearAttachmentInfoValidators(this.quotFormGroup);
        this.quotFormGroup = this.clearPolicyInfoValidators(this.quotFormGroup);
        let riskInfoArray: any = this.quotFormGroup.controls['riskInfo'];
        let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
        this.quotFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required,Validators.minLength(12)]));
        lifeAssuredInfo.get('appFName').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('appLName').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('DOB').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['policyInfo'].get('productCd').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('emailId').setErrors(null);
        this.quotFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat]));
        this.quotFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required,Validators.minLength(12)]));
        let benficiaryInfoForm: FormArray = <FormArray>this.quotFormGroup.controls['beneficiaryInfo'];
        this.setbeneficiaryInfoValidation(benficiaryInfoForm.at(0));
        return this.quotFormGroup;
    }

    setQuotValidator(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
        let riskInfoArray: any = this.quotFormGroup.controls['riskInfo'];
        let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
        this.quotFormGroup.controls['policyInfo'].get('sumAssured').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['policyInfo'].get('paymentTypeCode').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['policyInfo'].get('paymentTypeDesc').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['policyInfo'].get('policyTerm').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(1)]));
        this.quotFormGroup.controls['policyInfo'].get('premiumTerm').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(1)]));
        lifeAssuredInfo.get('occupation').setValidators(Validators.compose([Validators.required]));
        return this.quotFormGroup;
    }

    setRidersValidation(ridersInfo) {
        ridersInfo.get('riderSA').setValidators(Validators.compose([Validators.required]));
        ridersInfo.get('riderTerm').setValidators(Validators.compose([Validators.required]));
        return this.quotFormGroup;
    }

    setAttachmentValidation(attachmentInfo) {
        attachmentInfo.controls.forEach(attachmentForm => {
            attachmentForm.controls['fileName'].setValidators(Validators.compose([Validators.required]))
        });
        return attachmentInfo
    }

    setCustomerInfoValidation(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
        this.quotFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([Validators.required,Validators.minLength(10)]));
        this.quotFormGroup.controls['customerInfo'].get('DOB').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('gender').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('height').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('weight').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        this.quotFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required,Validators.minLength(12)]));
        this.quotFormGroup.controls['customerInfo'].get('occupation').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('prefix').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('prefixDesc').setValidators(Validators.compose([Validators.required]));
        this.quotFormGroup.controls['customerInfo'].get('appFatherName').setValidators(Validators.compose([Validators.required]));
        return this.quotFormGroup;

    }

    setLifeAssuredInfoValidation(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
        let riskInfoArray: any = this.quotFormGroup.controls['riskInfo'];
        let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
        lifeAssuredInfo.get('appFName').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('appLName').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('identityNo').setValidators(Validators.compose([Validators.required,Validators.minLength(10)]));
        lifeAssuredInfo.get('DOB').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('gender').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('height').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('weight').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('emailId').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        lifeAssuredInfo.get('mobilePh').setValidators(Validators.compose([Validators.required,Validators.minLength(12)]));
        lifeAssuredInfo.get('occupation').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('prefix').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('prefixDesc').setValidators(Validators.compose([Validators.required]));
        lifeAssuredInfo.get('appFatherName').setValidators(Validators.compose([Validators.required]));
        return this.quotFormGroup;
    }

    setbeneficiaryInfoValidation(beneficiaryFormGroup) {
        beneficiaryFormGroup.get('appFName').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('appLName').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('identityNo').setValidators(Validators.compose([Validators.required,Validators.minLength(10)]));
        beneficiaryFormGroup.get('DOB').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('gender').setValidators(Validators.compose([Validators.required]));
        //beneficiaryFormGroup.get('emailId').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        beneficiaryFormGroup.get('mobilePh').setValidators(Validators.compose([Validators.required,Validators.minLength(12)]));
        beneficiaryFormGroup.get('prefix').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('prefixDesc').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('appFatherName').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('beneficiaryLevelCode').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('beneficiaryLevelDesc').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('beneficiaryShare').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('relationWithAppDesc').setValidators(Validators.compose([Validators.required]));
        beneficiaryFormGroup.get('relationWithAppCode').setValidators(Validators.compose([Validators.required]));
        return beneficiaryFormGroup;
    }
    clearBeneficiaryValidator(beneficiaryFormGroup) {
        beneficiaryFormGroup.clearValidators();
        return beneficiaryFormGroup;
    }
    clearCustomerInfoValidation(quotFormGroup) {
        quotFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('gender').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('height').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('weight').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('emailId').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('mobilePh').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('occupation').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('prefix').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('prefixDesc').setValidators(null);
        quotFormGroup.controls['customerInfo'].get('appFatherName').setValidators(null);
        return quotFormGroup;
    }
    clearInsuredInfoValidation(quotFormGroup) {
        let riskInfoArray: any = this.quotFormGroup.controls['riskInfo'];
        let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
        lifeAssuredInfo.get('appFName').setValidators(null);
        lifeAssuredInfo.get('appLName').setValidators(null);
        lifeAssuredInfo.get('identityNo').setValidators(null);
        lifeAssuredInfo.get('DOB').setValidators(null);
        lifeAssuredInfo.get('gender').setValidators(null);
        lifeAssuredInfo.get('height').setValidators(null);
        lifeAssuredInfo.get('weight').setValidators(null);
        lifeAssuredInfo.get('emailId').setValidators(null);
        lifeAssuredInfo.get('mobilePh').setValidators(null);
        lifeAssuredInfo.get('occupation').setValidators(null);
        lifeAssuredInfo.get('prefix').setValidators(null);
        lifeAssuredInfo.get('prefixDesc').setValidators(null);
        lifeAssuredInfo.get('appFatherName').setValidators(null);
        return quotFormGroup;
    }
    clearAttachmentInfoValidators(quotFormGroup) {
        let attachmentInfo: FormArray = <FormArray>quotFormGroup.controls['customerInfo'].get('attachments');
        attachmentInfo.controls.forEach((attachMent) => {
            attachMent.get('fileName').setValidators(null);
        });
        return quotFormGroup
    }

    clearPolicyInfoValidators(quotFormGroup) {
        quotFormGroup.controls['policyInfo'].get('sumAssured').setValidators(null);
        quotFormGroup.controls['policyInfo'].get('paymentTypeCode').setValidators(null);
        quotFormGroup.controls['policyInfo'].get('policyTerm').setValidators(null);
        quotFormGroup.controls['policyInfo'].get('premiumTerm').setValidators(null);
        return quotFormGroup;
    }
}