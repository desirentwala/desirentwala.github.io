import { ConfigService } from '../../../../core/services/config.service';
import { DateFormatService } from '../../../../core/ui-components/ncp-date-picker/index';
import { DateDuration } from '../../../../core/ui-components/ncp-date-picker/index';
import { FormGroup } from '@angular/forms';
export class AviationDefaultValue {
    travelQuotForm: FormGroup;
    config;
    dateFormatService;
    dateDuration;
    isB2bc: boolean = false;
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
    setAviationQuotDefaultValues(travelQuotForm, productCode, defaultValues?: Object) {
        this.travelQuotForm = travelQuotForm;
        let patchedDefaultValues = defaultValues ? defaultValues : {};
        this.travelQuotForm.controls['policyInfo'].get('productCd').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['productCode'] ? patchedDefaultValues['policyInfo']['productCode'] : productCode);
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 365);
        let todayString = this.dateFormatService.formatDate(today);
        let tomorrowString = this.dateFormatService.formatDate(tomorrow);
        this.travelQuotForm.controls['policyInfo'].get('policyPlan').patchValue('hourly');
        //this.travelQuotForm.controls['policyInfo'].get('policyTerm').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['policyTerm'] ? patchedDefaultValues['policyInfo']['policyTerm'] : '07');
        let tempFormGroup;
        let riskInfoArray: any = this.travelQuotForm.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        let insuredFormGroup;
        let insuredInfoArray: any = tempFormGroup.controls['pilotInfo'];
        let insuredType = insuredInfoArray.at(0);
        insuredFormGroup = insuredType;
        insuredFormGroup.get('isPilotCertified').patchValue(true);

        let tempFormGroup1;
        let riskInfoArray1: any = this.travelQuotForm.controls['riskInfo'];
        let travellerType1 = riskInfoArray1.at(0);
        tempFormGroup1 = travellerType1;
        // let insuredFormGroup1;
        // let insuredInfoArray1: any = tempFormGroup1.controls['aviationUsageVOList'];
        // let insuredType1 = insuredInfoArray1.at(0);
        // insuredFormGroup1 = insuredType1;
        // insuredFormGroup1.get('additionalEquipments').patchValue(true);
        
        this.travelQuotForm.controls['policyInfo'].get('inceptionDt').patchValue(todayString);
        this.travelQuotForm.controls['policyInfo'].get('expiryDt').patchValue(tomorrowString);
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
        this.travelQuotForm.controls['policyInfo'].get('category').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['category'] ? patchedDefaultValues['policyInfo']['category'] : 'D');
        this.travelQuotForm.controls['policyInfo'].get('branchCd').patchValue(this.userBranch);
        this.travelQuotForm.controls['policyInfo'].get('branchCd').updateValueAndValidity();
        this.travelQuotForm.controls['policyInfo'].get('agentName').patchValue(this.config.getCustom('user_name'));
        this.travelQuotForm.controls['policyInfo'].get('agentName').updateValueAndValidity();
        this.isB2bc = this.config.getCustom('b2cFlag');
        this.isB2b2c = this.config.getCustom('b2b2cFlag');
        if (this.isB2bc) {
            this.travelQuotForm.controls['policyInfo'].get('source').patchValue('NCP');
            this.travelQuotForm.controls['policyInfo'].get('source').updateValueAndValidity();
        } else if (this.isB2b2c) {
            this.travelQuotForm.controls['policyInfo'].get('source').patchValue('NCP');
            this.travelQuotForm.controls['policyInfo'].get('source').updateValueAndValidity();
            this.travelQuotForm.controls['policyInfo'].get('promoCode').patchValue(this.config.getCustom('promoCode'));
            this.travelQuotForm.controls['policyInfo'].get('promoCode').updateValueAndValidity();
        } else {
            this.travelQuotForm.controls['policyInfo'].get('source').patchValue('NCP');
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
         this.travelQuotForm.controls['policyInfo'].get('policyPurpose').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['policyPurpose'] ? patchedDefaultValues['policyInfo']['policyPurpose'] : 'C');
         this.travelQuotForm.controls['policyInfo'].get('policyPlan').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['policyPlan'] ? patchedDefaultValues['policyInfo']['policyPlan'] : 'a');
         this.travelQuotForm.controls['policyInfo'].get('flyingTerritoryWorld').patchValue(patchedDefaultValues['policyInfo'] && patchedDefaultValues['policyInfo']['flyingTerritoryWorld'] ? patchedDefaultValues['policyInfo']['flyingTerritoryWorld'] : 'world');
         this.travelQuotForm.controls['customerInfo'].get('subsidiary').patchValue('Subsidiary and affiliated companies appearing above means any company or entity of which at least fifty percent (50%) of the stock or, if a partnership, fifty percent (50%) interest in the partnership, is owned by the Named Insured or for which the Named Insured has assumed active management.');
        //  this.travelQuotForm.controls['policyInfo'].get('PolicyType').patchValue('LO');
         return this.travelQuotForm;
    }
}