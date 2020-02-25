import { FormGroup } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';
import { DateDuration, DateFormatService } from '../../../../core/ui-components/ncp-date-picker/index';
export class MarineDefaultValue {
    marineQuoteForm: FormGroup;
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
    setMarineQuoteDefaultValues(marineQuoteForm, productCode, defaultValues: Object) {
        this.marineQuoteForm = marineQuoteForm;
        let patchedDefaultValues = defaultValues ? defaultValues : {};
        this.marineQuoteForm.controls['policyInfo'].get('productCd').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['productCode'] ? patchedDefaultValues['policyInfo']['productCode'] : productCode);
        let today = new Date();
        let year = today.getFullYear();
        let futureDate = new Date();
        if (today.getDate() != 1) {
            today.setDate(1);
            today.setMonth(today.getMonth() + 1);
            futureDate.setDate(0);
            futureDate.setMonth(today.getMonth());
        }
        futureDate = new Date(today.getFullYear() + 1, today.getMonth(), 0);
        let futureDateString = this.dateFormatService.formatDate(futureDate);
        let todayString = this.dateFormatService.formatDate(today);
        this.marineQuoteForm.controls['policyInfo'].get('policyTerm').patchValue('01');
        this.marineQuoteForm.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
        this.marineQuoteForm.controls['policyInfo'].get('ratingFlag').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['ratingFlag'] ? patchedDefaultValues['policyInfo']['ratingFlag'] : false);
        this.marineQuoteForm.controls['policyInfo'].get('ratingFlag').updateValueAndValidity();
        this.marineQuoteForm.controls['policyInfo'].get('inceptionDt').patchValue(todayString);
        this.marineQuoteForm.controls['policyInfo'].get('expiryDt').patchValue(futureDateString);
        this.marineQuoteForm.controls['policyInfo'].get('effectiveDt').patchValue(todayString);
        this.marineQuoteForm.controls['policyInfo'].get('effectiveDt').disable();
        this.marineQuoteForm.controls['policyInfo'].get('proposalDate').patchValue(todayString);
        this.marineQuoteForm.controls['policyInfo'].get('proposalDate').disable();
        let coverFromDate = this.marineQuoteForm.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.marineQuoteForm.controls['policyInfo'].value.expiryDt;
        if (coverToDate) {
            let returnValues = this.dateDuration.transform(coverFromDate, coverToDate);
            this.marineQuoteForm.controls['policyInfo'].get('durationInDays').patchValue(returnValues.noOfDays);
        }
        this.marineQuoteForm.controls['paymentInfo'].get('paymentDate').patchValue(todayString);
        this.marineQuoteForm.controls['paymentInfo'].get('chequeDate').patchValue(todayString);
        this.marineQuoteForm.controls['customerInfo'].get('policyHolderType').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['policyHolderType'] ? patchedDefaultValues['customerInfo']['policyHolderType'] : 'I');
        this.marineQuoteForm.controls['customerInfo'].get('gender').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['gender'] ? patchedDefaultValues['customerInfo']['gender'] : 'M');
        this.marineQuoteForm.controls['customerInfo'].get('cardInfo').get('isAutoRenewalApplicable').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] ? patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] : false);
        this.marineQuoteForm.controls['policyInfo'].get('category').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['category'] ? patchedDefaultValues['policyInfo']['category'] : 'D');
        this.marineQuoteForm.controls['policyInfo'].get('branchCd').patchValue(this.userBranch);
        this.marineQuoteForm.controls['policyInfo'].get('branchCd').disable();
        this.marineQuoteForm.controls['policyInfo'].get('branchCd').updateValueAndValidity();
        this.marineQuoteForm.controls['policyInfo'].get('businessTypeCode').patchValue('BB');
        this.marineQuoteForm.controls['policyInfo'].get('businessTypeCode').disable();
        this.marineQuoteForm.controls['policyInfo'].get('businessTypeCode').updateValueAndValidity();
        this.marineQuoteForm.controls['policyInfo'].get('isCoInsurance').patchValue('N');
            this.marineQuoteForm.controls['policyInfo'].get('tradeFreeZone').patchValue('N');
        this.isB2c = this.config.getCustom('b2cFlag');
        this.isB2b2c = this.config.getCustom('b2b2cFlag');
        if (this.isB2c) {
            this.marineQuoteForm.controls['policyInfo'].get('source').patchValue('B2C');
            this.marineQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        } else if (this.isB2b2c) {
            this.marineQuoteForm.controls['policyInfo'].get('source').patchValue('B2BC');
            this.marineQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        } else {
            this.marineQuoteForm.controls['policyInfo'].get('source').patchValue('B2B');
            this.marineQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        }
        return this.marineQuoteForm;
    }
}