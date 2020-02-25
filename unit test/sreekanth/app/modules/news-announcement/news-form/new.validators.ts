import { DateValidator } from './../../../core/ui-components/validators/date/date.validator';
import { FormGroup, Validator, Validators } from '@angular/forms';
import { MaxNumberValidator } from '../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../core/ui-components/validators/minnumber/minnumber.validator';
import { EmailIdvalidators } from '../../../core/ui-components/validators/emailid/emailid.validator';

export class NewsValidator {
    newsCreationFormGroup: FormGroup;

    setNewsValidator(customerDetailFormGroup) {
        this.newsCreationFormGroup = customerDetailFormGroup;

        this.newsCreationFormGroup.controls['newsTitle'].setValidators(Validators.required);
        this.newsCreationFormGroup.controls['newsDetails'].setValidators(Validators.required);
        this.newsCreationFormGroup.controls['startDate'].setValidators(Validators.required);
        this.newsCreationFormGroup.controls['endDate'].setValidators(Validators.required);
        this.newsCreationFormGroup.controls['newsType'].setValidators(Validators.required);
        // this.newsCreationFormGroup.controls['creationDate'].setValidators(DateValidator.validateDate);
        return this.newsCreationFormGroup;
    }



}