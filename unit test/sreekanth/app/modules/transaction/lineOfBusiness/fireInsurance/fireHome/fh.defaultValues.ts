import { ConfigService } from '../../../../../core/services/config.service';
import { DateFormatService } from '../../../../../core/ui-components/ncp-date-picker/index';
import { DateDuration } from '../../../../../core/ui-components/ncp-date-picker/index';
import { FormGroup } from '@angular/forms';
export class FHDefaultValue {
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
    setFHQuoteDefaultValues(fhQuoteForm, productCode, defaultValues: Object) {
        this.fhQuoteForm = fhQuoteForm;
        let patchedDefaultValues = defaultValues ? defaultValues : {};
        this.fhQuoteForm.controls['policyInfo'].get('productCd').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['productCode'] ? patchedDefaultValues['policyInfo']['productCode'] : productCode);
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let todayString = this.dateFormatService.formatDate(today);
        this.fhQuoteForm.controls['policyInfo'].get('policyTerm').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['policyTerm'] ? patchedDefaultValues['policyInfo']['policyTerm'] : '03');
        this.fhQuoteForm.controls['policyInfo'].get('numOfBuildings').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['numOfBuildings'] ? patchedDefaultValues['policyInfo']['numOfBuildings'] : '1');
        this.fhQuoteForm.controls['policyInfo'].get('numOfBuildings').updateValueAndValidity();
        this.fhQuoteForm.controls['policyInfo'].get('ratingFlag').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['ratingFlag'] ? patchedDefaultValues['policyInfo']['ratingFlag'] : false);
        this.fhQuoteForm.controls['policyInfo'].get('ratingFlag').updateValueAndValidity();
        let tempFormGroup;
        let riskInfoArray: any = this.fhQuoteForm.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        this.fhQuoteForm.controls['policyInfo'].get('inceptionDt').patchValue(todayString);
        this.fhQuoteForm.controls['policyInfo'].get('expiryDt').patchValue(todayString);
        let coverFromDate = this.fhQuoteForm.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.fhQuoteForm.controls['policyInfo'].value.expiryDt;
        if (coverToDate) {
            let returnValues = this.dateDuration.transform(coverFromDate, coverToDate);
            this.fhQuoteForm.controls['policyInfo'].get('durationInDays').patchValue(returnValues.noOfDays);
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
        if((this.config.getCustom('user_type')) === "OP"){
            // this.fhQuoteForm.controls['policyInfo'].get('agentCd').patchValue(this.config.getCustom('user_party_id'));
            // this.fhQuoteForm.controls['policyInfo'].get('agentCd').updateValueAndValidity(); 
            this.fhQuoteForm.controls['policyInfo'].get('calculateCommissionFlag').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['calculateCommissionFlag'] ? patchedDefaultValues['policyInfo']['calculateCommissionFlag'] : 'N');
            this.fhQuoteForm.controls['policyInfo'].get('calculateCommissionFlag').updateValueAndValidity();  
                     
         }else{           
            this.fhQuoteForm.controls['policyInfo'].get('agentCd').updateValueAndValidity();
         }
        return this.fhQuoteForm;
    }
}