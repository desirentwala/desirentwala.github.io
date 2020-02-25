import { Validators, FormGroup } from '@angular/forms';
import { MaxNumberValidator } from '../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../core/ui-components/validators/minnumber/minnumber.validator';
import { EmailIdvalidators } from '../../../core/ui-components/validators/emailid/emailid.validator';
import { MaxSizeValidator } from '../../../core/ui-components/validators/maxsize/maxsize.validator';

export class CustomerFormValidator {
    customerFormGroup: FormGroup;

    setCustomerInfoValidator(_customerForm) {
        this.customerFormGroup = _customerForm;
        this.customerFormGroup.controls['customerInfo'].get('policyHolderType').setValidators(Validators.compose([Validators.required]));
        this.customerFormGroup.controls['customerInfo'].get('policyHolderType').updateValueAndValidity();

        if (this.customerFormGroup.controls['customerInfo'].get('policyHolderType').value === 'O') {
            this.customerFormGroup.controls['customerInfo'].get('companyName').setValidators(Validators.compose([Validators.required,MaxSizeValidator.maxSize(30)]));
            this.customerFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('companyRegNumber').setValidators(Validators.compose([Validators.required,MaxSizeValidator.maxSize(30)]));
            this.customerFormGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('occupationCode').setValidators(Validators.compose([Validators.required,MaxSizeValidator.maxSize(30)]));
            this.customerFormGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('contactPersonFirstName').setValidators(Validators.compose([Validators.required,MaxSizeValidator.maxSize(30),Validators.pattern('^[a-zA-Z]*$')]));
            this.customerFormGroup.controls['customerInfo'].get('contactPersonFirstName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('contactPersonLastName').setValidators(Validators.compose([Validators.required,MaxSizeValidator.maxSize(30),Validators.pattern('^[a-zA-Z]*$')]));
            this.customerFormGroup.controls['customerInfo'].get('contactPersonLastName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('appFName').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('appLName').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('age').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('DOB').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('identityNo').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        } else {
            this.customerFormGroup.controls['customerInfo'].get('appFName').setValidators(Validators.compose([Validators.required,MaxSizeValidator.maxSize(30),Validators.pattern('^[a-zA-Z]*$')]));
            this.customerFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('appLName').setValidators(Validators.compose([Validators.required,MaxSizeValidator.maxSize(30),Validators.pattern('^[a-zA-Z]*$')]));
            this.customerFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('DOB').setValidators(Validators.compose([Validators.required]));
            this.customerFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('age').setValidators(Validators.compose([Validators.required, MinNumberValidator.minNumber(18)]));
            this.customerFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').setValidators(Validators.compose([Validators.required]));
            this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('identityNo').setValidators(Validators.compose([Validators.required]));
            this.customerFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('companyName').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('companyRegNumber').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('occupationCode').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('contactPersonFirstName').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('contactPersonFirstName').updateValueAndValidity();
            this.customerFormGroup.controls['customerInfo'].get('contactPersonLastName').setValidators(null);
            this.customerFormGroup.controls['customerInfo'].get('contactPersonLastName').updateValueAndValidity();
        }
          
        this.customerFormGroup.controls['customerInfo'].get('zipCd').setValidators(Validators.compose([Validators.required, Validators.maxLength(6)]));
        this.customerFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity(); 
        this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').setValidators(Validators.compose([Validators.required]));
        this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('blockNumber').setValidators(Validators.compose([Validators.required]));
        this.customerFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('mobilePh').setValidators(Validators.compose([Validators.required]));
        this.customerFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('emailId').setValidators(Validators.compose([EmailIdvalidators.mailFormat,Validators.required]));
        this.customerFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].updateValueAndValidity();

        return this.customerFormGroup;

    }

}