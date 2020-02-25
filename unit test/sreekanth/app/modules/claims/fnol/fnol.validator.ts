import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { FormArray } from '@angular/forms/src/model';
import { EmailIdvalidators } from '../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../core/ui-components/validators/minnumber/minnumber.validator';
import { FormGroup, Validators } from '@angular/forms';
import { MaxSizeValidator } from '../../../core/ui-components/validators/maxsize/maxsize.validator';
import { ConfigService } from '../../../core/services/config.service';

export class FnolValidator {
    fnolFormGroup: FormGroup;
    config: ConfigService;
    isProductBuildFlag: boolean = false;
    setClaimFNOLBasicDetailsValidator(claimFNOLForm, isProductBuildFlag: boolean = false) {
        // this.isProductBuildFlag = this.config.get('build') === '';
        this.fnolFormGroup = claimFNOLForm;
        //this.fnolFormGroup.controls['policyInfo'].get('policyNo').setValidators(Validators.compose([Validators.required]));
        if (!isProductBuildFlag)
            this.fnolFormGroup.controls['claimInfo'].get('claimantName').setValidators(Validators.required);
        this.fnolFormGroup.controls['claimInfo'].get('notifierClientMobile').setValidators(Validators.maxLength(15));
        this.fnolFormGroup.controls['claimInfo'].get('notifierClientEmail').setValidators(Validators.compose([Validators.required, EmailIdvalidators.mailFormat]));
        return this.fnolFormGroup;
    }

    setClaimFNOLInsuredDetailsValidator(claimFNOLForm) {
        this.fnolFormGroup = claimFNOLForm;
        this.fnolFormGroup.controls['claimInfo'].get('lossDate').setValidators(Validators.compose([Validators.required]));
        this.fnolFormGroup.controls['claimInfo'].get('lossDate').updateValueAndValidity();
        this.fnolFormGroup.controls['claimInfo'].get('incidentDesc').setValidators(Validators.compose([Validators.required]));
        this.fnolFormGroup.controls['claimInfo'].get('incidentDesc').updateValueAndValidity();
        return this.fnolFormGroup;
    }
    // setLossDateValidator( utilsService: any , dateDurationService: any, claimFNOLForm: any ){
    //     this.fnolFormGroup = claimFNOLForm;
    //     let polFromDate = this.fnolFormGroup.controls['policyInfo'].get('inceptionDt').value;
    //     let polToDate = this.fnolFormGroup.controls['policyInfo'].get('expiryDt').value;
    //     let lossDate = this.fnolFormGroup.controls['claimInfo'].get('lossDate').value;
    //     let todayDate = utilsService.getTodayDate();
    //     let dateDuration = dateDurationService.transform(polFromDate, polToDate);
    //     let transLossDate = dateDurationService.transform(lossDate);
    //     if (transLossDate.startDate < dateDuration.startDate || transLossDate.startDate > dateDuration.endDate) {
    //         this.fnolFormGroup.controls['claimInfo'].get('lossDate').patchValue(null);
    //         this.fnolFormGroup.controls['claimInfo'].get('lossDate').updateValueAndValidity();
    //         this.fnolFormGroup.controls['claimInfo'].get('lossDate').setValidators(Validators.compose([Validators.nullValidator]));
    //     }
    // }
    clearClaimFNOLInsuredDetailsValidator(claimFNOLForm) {
        this.fnolFormGroup = claimFNOLForm;
        this.fnolFormGroup.controls['claimInfo'].get('lossDate').setValidators(null);
        // this.fnolFormGroup.controls['claimInfo'].get('lossDate').reset();
        this.fnolFormGroup.controls['claimInfo'].get('lossDate').updateValueAndValidity();
        this.fnolFormGroup.controls['claimInfo'].get('incidentDesc').setValidators(null);
        // this.fnolFormGroup.controls['claimInfo'].get('incidentDesc').reset();
        this.fnolFormGroup.controls['claimInfo'].get('incidentDesc').updateValueAndValidity();
        return this.fnolFormGroup;
    }
    setAttachmentValidations(claimFNOLForm){
        this.fnolFormGroup = claimFNOLForm;
        let attachments: FormArray = <FormArray>this.fnolFormGroup.controls['attachments'];
        for(let i=0;i<attachments.length;i++){
            attachments.at(i).get('fileName').setValidators(Validators.compose([Validators.required]));
        }
        attachments.updateValueAndValidity();
        this.fnolFormGroup.controls['attachments']=attachments;
        return this.fnolFormGroup;
    }

    clearAttachmentValidations(claimFNOLForm){
        this.fnolFormGroup = claimFNOLForm;
        let attachments: FormArray = <FormArray>this.fnolFormGroup.controls['attachments'];
        for(let i=0;i<attachments.length;i++){
            attachments.at(i).get('fileName').setValidators(Validators.compose([Validators.required]));
        }
        attachments.updateValueAndValidity();
        this.fnolFormGroup.controls['attachments']=attachments;
        return this.fnolFormGroup;
    }

}
