import { ConfigService } from '../../../../core/services/config.service';
import { DateFormatService } from '../../../../core/ui-components/ncp-date-picker/index';
import { DateDuration } from '../../../../core/ui-components/ncp-date-picker/index';
import { FormGroup } from '@angular/forms';
export class TravelDefaultValue {
    travelQuotForm: FormGroup;
    config;
    dateFormatService;
    dateDuration;
    isB2c: boolean = false;
    isB2b2c: boolean = false;
    travellerTypeCodeIndividual = 'IND';
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
    setTravelQuotDefaultValues(travelQuotForm, productCode, defaultValues?: Object) {
        this.travelQuotForm = travelQuotForm;
        let patchedDefaultValues = defaultValues ? defaultValues : {};
        this.travelQuotForm.controls['policyInfo'].get('productCd').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['productCode'] ? patchedDefaultValues['policyInfo']['productCode'] : productCode);
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let todayString = this.dateFormatService.formatDate(today);
        this.travelQuotForm.controls['policyInfo'].get('policyTerm').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['policyTerm'] ? patchedDefaultValues['policyInfo']['policyTerm'] : '07');
        let tempFormGroup;
        let riskInfoArray: any = this.travelQuotForm.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        tempFormGroup.get('travellerTypeCode').patchValue(patchedDefaultValues['riskInfo'] && patchedDefaultValues['riskInfo'][0]['travellerTypeCode'] ? patchedDefaultValues['riskInfo'][0]['travellerTypeCode'] : this.travellerTypeCodeIndividual);
        tempFormGroup.get('travellerTypeCode').updateValueAndValidity();
        tempFormGroup.get('travellerTypeDesc').patchValue('Individual');
        tempFormGroup.get('travellerTypeDesc').updateValueAndValidity();
        this.travelQuotForm.controls['policyInfo'].get('inceptionDt').patchValue(todayString);
        this.travelQuotForm.controls['policyInfo'].get('expiryDt').patchValue(todayString);
        let coverFromDate = this.travelQuotForm.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.travelQuotForm.controls['policyInfo'].value.expiryDt;
        if (coverToDate) {
            let returnValues = this.dateDuration.transform(coverFromDate, coverToDate);
            this.travelQuotForm.controls['policyInfo'].get('durationInDays').patchValue(returnValues.noOfDays);
        }
        this.travelQuotForm.controls['paymentInfo'].get('paymentDate').patchValue(todayString);
        this.travelQuotForm.controls['paymentInfo'].get('chequeDate').patchValue(todayString);
        this.travelQuotForm.controls['customerInfo'].get('policyHolderType').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['policyHolderType'] ? patchedDefaultValues['customerInfo']['policyHolderType'] : 'I');
        this.travelQuotForm.controls['customerInfo'].get('gender').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['gender'] ? patchedDefaultValues['customerInfo']['gender'] : 'M');
        this.travelQuotForm.controls['customerInfo'].get('cardInfo').get('isAutoRenewalApplicable').patchValue(patchedDefaultValues['customerInfo'] && patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] ? patchedDefaultValues['customerInfo']['isAutoRenewalApplicable'] : 'N');
        this.travelQuotForm.controls['policyInfo'].get('category').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['category'] ? patchedDefaultValues['policyInfo']['category'] : 'D');
        this.travelQuotForm.controls['policyInfo'].get('branchCd').patchValue(this.userBranch);
        this.travelQuotForm.controls['policyInfo'].get('branchCd').updateValueAndValidity();
        let riskTempFormGroup: any = this.travelQuotForm.controls['riskInfo'];
        let insuredFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
        let nomineeList = insuredFormGroup.at(0).get('nomineeList').at(0);
        nomineeList.get('nomineeShare').patchValue('100'); 
        this.isB2c = this.config.getCustom('b2cFlag');
        this.isB2b2c = this.config.getCustom('b2b2cFlag');
        if (this.isB2c) {
            this.travelQuotForm.controls['policyInfo'].get('source').patchValue('B2C');
            this.travelQuotForm.controls['policyInfo'].get('source').updateValueAndValidity();
        } else if (this.isB2b2c) {
            this.travelQuotForm.controls['policyInfo'].get('source').patchValue('B2BC');
            this.travelQuotForm.controls['policyInfo'].get('source').updateValueAndValidity();
            this.travelQuotForm.controls['policyInfo'].get('promoCode').patchValue(this.config.getCustom('promoCode'));
            this.travelQuotForm.controls['policyInfo'].get('promoCode').updateValueAndValidity();
        } else {
            this.travelQuotForm.controls['policyInfo'].get('source').patchValue('B2B');
            this.travelQuotForm.controls['policyInfo'].get('source').updateValueAndValidity();
        }
         if((this.config.getCustom('user_type')) === "OP"){
            //this.travelQuotForm.controls['policyInfo'].get('agentCd').patchValue(this.config.getCustom('user_party_id'));
            //this.travelQuotForm.controls['policyInfo'].get('agentCd').updateValueAndValidity(); 
            this.travelQuotForm.controls['policyInfo'].get('calculateCommissionFlag').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['calculateCommissionFlag'] ? patchedDefaultValues['policyInfo']['calculateCommissionFlag'] : 'N');
            this.travelQuotForm.controls['policyInfo'].get('calculateCommissionFlag').updateValueAndValidity(); 
                                 
            
         }else{           
            this.travelQuotForm.controls['policyInfo'].get('agentCd').updateValueAndValidity();
         }
        return this.travelQuotForm;
    }
}