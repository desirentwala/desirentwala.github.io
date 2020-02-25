import { Validators, FormGroup } from '@angular/forms';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker/index';
import { DateDuration } from '../../../core/ui-components/ncp-date-picker/index';
import { ConfigService } from '../../../core/services/config.service';
export class FnolDefaultValue {
    fnolFormGroup: FormGroup;
    config;
    dateFormatService;
    dateDuration;

    constructor(_config?: ConfigService) {
        this.config = _config;
        this.dateFormatService = new DateFormatService(this.config);
        this.dateDuration = new DateDuration(this.config);
    }

    setClaimFNOLDefaultValues(claimFNOLForm, isProductBuild: boolean = false) {
        this.fnolFormGroup = claimFNOLForm;
        let momentType =  this.config.get('movementType');
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let todayString = this.dateFormatService.formatDate(today);
        let tomorrowString = this.dateFormatService.formatDate(tomorrow);
        this.fnolFormGroup.controls['claimInfo'].get('noticeDate').patchValue(todayString);
        this.fnolFormGroup.controls['claimInfo'].get('noticeDate').updateValueAndValidity(); 
        this.fnolFormGroup.controls['claimInfo'].get('lossDate').patchValue(todayString);
        this.fnolFormGroup.controls['claimInfo'].get('lossDate').updateValueAndValidity();
         this.fnolFormGroup.controls['claimInfo'].get('lossTime').setValue('00:00:00');
        this.fnolFormGroup.controls['claimInfo'].get('movementType').patchValue(momentType);
        this.fnolFormGroup.controls['claimInfo'].get('movementType').updateValueAndValidity();
        this.fnolFormGroup.controls['claimInfo'].get('noticeBy').patchValue('0005');
        this.fnolFormGroup.controls['claimInfo'].get('noticeBy').updateValueAndValidity();
        return this.fnolFormGroup;
    }
} 