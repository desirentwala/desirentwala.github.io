import { FormGroup } from '@angular/forms';
import { ConfigService } from "../../../../core/services/config.service";
import { DateDuration, DateFormatService } from '../../../../core/ui-components/ncp-date-picker';

export class LifeDefaultValue {
    quoteForm: FormGroup
    dateFormatService: any;
    dateDuration: any;
    userBranch: any;
    config: any;
    isB2c: boolean = false;
    isB2b2c: boolean = false;
    lifeAssuredDefaultValue: any;
    constructor(_config?: ConfigService) {
        this.config = _config;
        this.dateFormatService = new DateFormatService(this.config);
        this.dateDuration = new DateDuration(this.config);
        this.userBranch = this.config.getCustom('user_branch');
        if (this.userBranch === undefined || this.userBranch === null || this.userBranch === '') {
            this.userBranch = this.config.get('user_branch');
        }
    }
    setLifeQuoteDefaultValues(quoteForm, productCode, defaultValues?: Object) {
        this.quoteForm = quoteForm;
        let tempFormGroup, tempBeneficiaryFormGroup;
        let riskInfoArray: any = this.quoteForm.controls['riskInfo'];
        let beneficiaryInfo: any = this.quoteForm.controls['beneficiaryInfo'];
        let customerInfo = <FormGroup>this.quoteForm.controls['customerInfo']
        tempFormGroup = riskInfoArray.at(0);
        let lifeAssuredInfo = tempFormGroup.get('insuredList').at(0);
        tempBeneficiaryFormGroup = beneficiaryInfo.at(0);
        this.quoteForm.controls['policyInfo'].get('branchCd').patchValue(this.userBranch);
        this.quoteForm.controls['policyInfo'].get('ratingFlag').patchValue(false);
        customerInfo = this.setCustomerDefaultValue(customerInfo);
        lifeAssuredInfo.get('partyExistsFlag').patchValue('N');
        lifeAssuredInfo.get('createPartyFlag').patchValue('Y');
        lifeAssuredInfo.get('gender').patchValue('M');
        lifeAssuredInfo.get('heightUnitCode').patchValue('1');
        lifeAssuredInfo.get('heightUnitCode').disable();
        lifeAssuredInfo.get('heightUnitDesc').patchValue('cm');
        lifeAssuredInfo.get('weightUnitCode').patchValue('0');
        lifeAssuredInfo.get('weightUnitDesc').patchValue('kg');
        tempBeneficiaryFormGroup.get('heightUnitCode').patchValue('1');
        tempBeneficiaryFormGroup.get('heightUnitCode').disable();
        tempBeneficiaryFormGroup.get('heightUnitDesc').patchValue('cm');
        tempBeneficiaryFormGroup.get('weightUnitCode').patchValue('0');
        tempBeneficiaryFormGroup.get('weightUnitCode').disable();
        tempBeneficiaryFormGroup.get('weightUnitDesc').patchValue('kg');
        tempBeneficiaryFormGroup.get('policyHolderType').patchValue('I');
        tempBeneficiaryFormGroup.get('gender').patchValue('M');
        this.quoteForm.controls['policyInfo'].get('productVersion').patchValue('01');
        tempBeneficiaryFormGroup.get('partyExistsFlag').patchValue('N');
        tempBeneficiaryFormGroup.get('createPartyFlag').patchValue('Y');
        tempBeneficiaryFormGroup.get('key').patchValue('001');
        tempBeneficiaryFormGroup.get('roleType').patchValue('BF');
        this.lifeAssuredDefaultValue = lifeAssuredInfo.getRawValue();
        return this.quoteForm;
    }
    setCustomerDefaultValue(customerInfo) {
        customerInfo.get('partyExistsFlag').patchValue('N');
        customerInfo.get('createPartyFlag').patchValue('Y');
        customerInfo.get('gender').patchValue('M');
        customerInfo.get('heightUnitDesc').patchValue('cm');
        customerInfo.get('heightUnitCode').patchValue('1');
        customerInfo.get('heightUnitCode').disable();
        customerInfo.get('weightUnitDesc').patchValue('kg');
        customerInfo.get('weightUnitCode').patchValue('0');
        customerInfo.get('weightUnitCode').disable();
        return customerInfo;
    }
    setSource(quoteForm) {
        this.quoteForm = quoteForm;
        this.isB2c = this.config.getCustom('b2cFlag');
        this.isB2b2c = this.config.getCustom('b2b2cFlag');
        if (this.isB2c) {
            this.quoteForm.controls['policyInfo'].get('source').patchValue('B2C');
            this.quoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        } else if (this.isB2b2c) {
            this.quoteForm.controls['policyInfo'].get('source').patchValue('B2BC');
            this.quoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
            this.quoteForm.controls['policyInfo'].get('promoCode').patchValue(this.config.getCustom('promoCode'));
            this.quoteForm.controls['policyInfo'].get('promoCode').updateValueAndValidity();
        } else {
            this.quoteForm.controls['policyInfo'].get('source').patchValue('B2B');
            this.quoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        }
        return this.quoteForm;
    }
    getLifeAssuredDefaultValues() {
        return this.lifeAssuredDefaultValue;
    }

    setBeneficiaryDefaultValues(beneficartyInfo) {
        return beneficartyInfo;
    }
    setMaturityBeneficiaryDefaultValues(beneficartyInfo) {
        return beneficartyInfo;
    }
}