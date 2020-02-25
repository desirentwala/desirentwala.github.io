import { FormArray, FormGroup } from '@angular/forms';
export class LifePolicyValidator {
    constructor() {
    }
    quotFormGroup: FormGroup;
    setBasicDetailsValidator(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
        
        return this.quotFormGroup;
    }

    setQuotValidator(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
       
        return this.quotFormGroup;
    }

    setRidersValidation(ridersInfo) {
        return this.quotFormGroup;
    }

    setAttachmentValidation(attachmentInfo) {
       
        return attachmentInfo
    }

    setCustomerInfoValidation(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
        
        return this.quotFormGroup;

    }

    setLifeAssuredInfoValidation(quotFormGroup) {
        this.quotFormGroup = quotFormGroup;
   
        return this.quotFormGroup;
    }

    setbeneficiaryInfoValidation(beneficiaryFormGroup) {
       
        return beneficiaryFormGroup;
    }
    clearBeneficiaryValidator(beneficiaryFormGroup) {
        beneficiaryFormGroup.clearValidators();
        return beneficiaryFormGroup;
    }
    clearCustomerInfoValidation(quotFormGroup) {
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