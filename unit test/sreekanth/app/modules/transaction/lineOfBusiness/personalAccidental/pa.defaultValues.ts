import { ConfigService } from '../../../../core/services/config.service';
import { DateFormatService } from '../../../../core/ui-components/ncp-date-picker/index';
import { DateDuration } from '../../../../core/ui-components/ncp-date-picker/index';
import { FormGroup } from '@angular/forms';
export class PADefaultValue {
    paQuoteForm: FormGroup;
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
    setPAQuoteDefaultValues(paQuoteForm, productCode, defaultValues: Object) {
        this.paQuoteForm = paQuoteForm;
        let patchedDefaultValues = defaultValues ? defaultValues : {};
        this.paQuoteForm.controls['policyInfo'].get('productCd').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['productCode'] ? patchedDefaultValues['policyInfo']['productCode'] : productCode);
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let todayString = this.dateFormatService.formatDate(today);
        this.paQuoteForm.controls['policyInfo'].get('policyTerm').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['policyTerm'] ? patchedDefaultValues['policyInfo']['policyTerm'] : '01');
        let tempFormGroup;
        let riskInfoArray: any = this.paQuoteForm.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        this.paQuoteForm.controls['policyInfo'].get('inceptionDt').patchValue(todayString);
        this.paQuoteForm.controls['policyInfo'].get('expiryDt').patchValue(todayString);
        let coverFromDate = this.paQuoteForm.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.paQuoteForm.controls['policyInfo'].value.expiryDt;
        if (coverToDate) {
            let returnValues = this.dateDuration.transform(coverFromDate, coverToDate);
            this.paQuoteForm.controls['policyInfo'].get('durationInDays').patchValue(returnValues.noOfDays);
        }
        this.paQuoteForm.controls['paymentInfo'].get('paymentDate').patchValue(todayString);
        this.paQuoteForm.controls['paymentInfo'].get('chequeDate').patchValue(todayString);
        this.paQuoteForm.controls['customerInfo'].get('policyHolderType').patchValue('I');
        this.paQuoteForm.controls['customerInfo'].get('gender').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['gender'] ? patchedDefaultValues['customerInfo']['gender'] : 'M');
        this.paQuoteForm.controls['customerInfo'].get('cardInfo').get('isAutoRenewalApplicable').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] ? patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] : 'N');
        this.paQuoteForm.controls['policyInfo'].get('category').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['category'] ? patchedDefaultValues['policyInfo']['category'] : 'D');
        this.paQuoteForm.controls['policyInfo'].get('branchCd').patchValue(this.userBranch);
        this.paQuoteForm.controls['policyInfo'].get('branchCd').updateValueAndValidity();
        riskInfoArray.at(0).get('nomineeList').at(0).get('nomineeShare').patchValue(100);
        riskInfoArray.at(0).get('nomineeList').at(0).get('nomineeShare').updateValueAndValidity();
        tempFormGroup.controls['sectCl'].patchValue(productCode);
        tempFormGroup.controls['hasSpouse'].patchValue(false);
        tempFormGroup.controls['numberofChildren'].patchValue(0);
        this.isB2c = this.config.getCustom('b2cFlag');
        this.isB2b2c = this.config.getCustom('b2b2cFlag');
        if (this.isB2c) {
            this.paQuoteForm.controls['policyInfo'].get('source').patchValue('B2C');
            this.paQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        } else if (this.isB2b2c) {
            this.paQuoteForm.controls['policyInfo'].get('source').patchValue('B2BC');
            this.paQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
            this.paQuoteForm.controls['policyInfo'].get('promoCode').patchValue(this.config.getCustom('promoCode'));
            this.paQuoteForm.controls['policyInfo'].get('promoCode').updateValueAndValidity();
        } else {
            this.paQuoteForm.controls['policyInfo'].get('source').patchValue('B2B');
            this.paQuoteForm.controls['policyInfo'].get('source').updateValueAndValidity();
        }
        if((this.config.getCustom('user_type')) === "OP"){
            // this.paQuoteForm.controls['policyInfo'].get('agentCd').patchValue(this.config.getCustom('user_party_id'));
            // this.paQuoteForm.controls['policyInfo'].get('agentCd').updateValueAndValidity();  
            this.paQuoteForm.controls['policyInfo'].get('calculateCommissionFlag').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['calculateCommissionFlag'] ? patchedDefaultValues['policyInfo']['calculateCommissionFlag'] : 'N');
            this.paQuoteForm.controls['policyInfo'].get('calculateCommissionFlag').updateValueAndValidity();          
         }else{           
            this.paQuoteForm.controls['policyInfo'].get('agentCd').updateValueAndValidity();
         }
        return this.paQuoteForm;
    }
}