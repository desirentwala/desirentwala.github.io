import { ConfigService } from '../../../../../core/services/config.service';
import { DateFormatService } from '../../../../../core/ui-components/ncp-date-picker/index';
import { DateDuration } from '../../../../../core/ui-components/ncp-date-picker/index';
import { FormGroup } from '@angular/forms';
export class PMDefaultValue {
    fhQuoteForm: FormGroup;
    config;
    dateFormatService;
    dateDuration;
    isB2c: boolean = false;
    isB2b2c: boolean = false;
    userBranch: any;
    constructor(_config?: ConfigService) {
        this.config = _config;
        this.dateFormatService = new DateFormatService(this.config);
        this.dateDuration = new DateDuration(this.config);
        this.userBranch = this.config.getCustom('user_branch');
        if (this.userBranch === undefined || this.userBranch === null || this.userBranch === '') {
            this.userBranch = this.config.get('user_branch');
        }
    }
    setPMQuoteDefaultValues(fhQuoteForm, productCode, defaultValues: Object) {
        this.fhQuoteForm = fhQuoteForm;
        let patchedDefaultValues = defaultValues ? defaultValues : {};
        this.fhQuoteForm.controls['policyInfo'].get('productCd').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['productCode'] ? patchedDefaultValues['policyInfo']['productCode'] : productCode);
        this.fhQuoteForm.controls['policyInfo'].get('policyTerm').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['policyTerm'] ? patchedDefaultValues['policyInfo']['policyTerm'] : '03');
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 364);
        let todayString = this.dateFormatService.formatDate(today);
        let tomorrowString = this.dateFormatService.formatDate(tomorrow);
        let tempFormGroup;
        let riskInfoArray: any = this.fhQuoteForm.controls['riskInfo'];
        let currentYear = today.getFullYear();
        riskInfoArray.at(0).get('vehicleManufacturingYear').patchValue(currentYear);
        riskInfoArray.at(0).get('vehicleAge').patchValue('0');
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        tempFormGroup.controls['insuredList'].at(0).get('genderCode').patchValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['insuredList'] && patchedDefaultValues['riskInfo'][0]['insuredList'][0]['genderCode'] ? patchedDefaultValues['riskInfo'][0]['insuredList'][0]['genderCode'] : 'M');
        tempFormGroup.controls['insuredList'].at(0).get('maritalStatusCode').patchValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['insuredList'] && patchedDefaultValues['riskInfo'][0]['insuredList'][0]['maritalStatusCode'] ? patchedDefaultValues['riskInfo'][0]['insuredList'][0]['maritalStatusCode'] : 'S');
        tempFormGroup.controls['insuredList'].at(0).get('hasDrivingLicense').patchValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['insuredList'] && patchedDefaultValues['riskInfo'][0]['insuredList'][0]['hasDrivingLicense'] !== undefined ? patchedDefaultValues['riskInfo'][0]['insuredList'][0]['hasDrivingLicense'] : true);
        tempFormGroup.get('ncdCode').setValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['ncdCode'] ? patchedDefaultValues['riskInfo'][0]['ncdCode'] : '50');
        tempFormGroup.get('ncdDesc').setValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['ncdDesc'] ? patchedDefaultValues['riskInfo'][0]['ncdDesc'] : '50%');
        tempFormGroup.get('hasVehicleModified').setValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['hasVehicleModified'] !== undefined ? patchedDefaultValues['riskInfo'][0]['hasVehicleModified'] : false);
        tempFormGroup.get('hasDriverClaimed').setValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['hasDriverClaimed'] !== undefined ? patchedDefaultValues['riskInfo'][0]['hasDriverClaimed'] : false);
        tempFormGroup.get('hasNCDProtection').setValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['hasNCDProtection'] !== undefined ? patchedDefaultValues['riskInfo'][0]['hasNCDProtection'] : false);
        tempFormGroup.get('excessLevelCode').setValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['excessLevelCode'] !== undefined ? patchedDefaultValues['riskInfo'][0]['excessLevelCode'] : 0);
        tempFormGroup.get('isVehicleHypothecated').setValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['isVehicleHypothecated'] !== undefined ? patchedDefaultValues['riskInfo'][0]['isVehicleHypothecated'] : false);
        this.fhQuoteForm.controls['policyInfo'].get('inceptionDt').patchValue(todayString);
        this.fhQuoteForm.controls['policyInfo'].get('expiryDt').patchValue(tomorrowString);
        let coverFromDate = this.fhQuoteForm.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.fhQuoteForm.controls['policyInfo'].value.expiryDt;
        if (coverToDate) {
            let returnValues = this.dateDuration.transform(coverFromDate, coverToDate);
            this.fhQuoteForm.controls['policyInfo'].get('durationInDays').patchValue(returnValues.noOfDays);
        }
        if (tempFormGroup.get('itemSi').value === '') {
            tempFormGroup.get('itemSi').patchValue('0.00');
        }
        this.fhQuoteForm.controls['paymentInfo'].get('paymentDate').patchValue(todayString);
        this.fhQuoteForm.controls['paymentInfo'].get('chequeDate').patchValue(todayString);
        this.fhQuoteForm.controls['customerInfo'].get('policyHolderType').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['policyHolderType'] ? patchedDefaultValues['customerInfo']['policyHolderType'] : 'I');
        this.fhQuoteForm.controls['customerInfo'].get('gender').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['gender'] ? patchedDefaultValues['customerInfo']['gender'] : 'M');
        this.fhQuoteForm.controls['customerInfo'].get('cardInfo').get('isAutoRenewalApplicable').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] ? patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] : 'N');
        this.fhQuoteForm.controls['policyInfo'].get('category').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['category'] ? patchedDefaultValues['policyInfo']['category'] : 'D');
        this.fhQuoteForm.controls['policyInfo'].get('branchCd').patchValue(this.userBranch);
        this.fhQuoteForm.controls['policyInfo'].get('branchCd').updateValueAndValidity();
        this.isB2c = this.config.getCustom('b2cFlag');
        this.isB2b2c = this.config.getCustom('b2b2cFlag');
        if (this.isB2c) {
            this.fhQuoteForm.controls['policyInfo'].get('source').patchValue('B2C');
            this.fhQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        } else if (this.isB2b2c) {
            this.fhQuoteForm.controls['policyInfo'].get('source').patchValue('B2BC');
            this.fhQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
            this.fhQuoteForm.controls['policyInfo'].get('promoCode').patchValue(this.config.getCustom('promoCode'));
            this.fhQuoteForm.controls['policyInfo'].get('promoCode').updateValueAndValidity();
        } else {
            this.fhQuoteForm.controls['policyInfo'].get('source').patchValue('B2B');
            this.fhQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        }
        if ((this.config.getCustom('user_type')) === "OP") {
            // this.fhQuoteForm.controls['policyInfo'].get('agentCd').patchValue(this.config.getCustom('user_party_id'));
            // this.fhQuoteForm.controls['policyInfo'].get('agentCd').updateValueAndValidity();
            this.fhQuoteForm.controls['policyInfo'].get('calculateCommissionFlag').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['calculateCommissionFlag'] ? patchedDefaultValues['policyInfo']['calculateCommissionFlag'] : 'N');
            this.fhQuoteForm.controls['policyInfo'].get('calculateCommissionFlag').updateValueAndValidity();
        } else {
            this.fhQuoteForm.controls['policyInfo'].get('agentCd').updateValueAndValidity();
        }
        return this.fhQuoteForm;
    }
}