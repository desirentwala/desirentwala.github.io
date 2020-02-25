import { Validators, FormGroup } from '@angular/forms';
import { MaxNumberValidator } from '../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { MinNumberValidator } from '../../../../core/ui-components/validators/minnumber/minnumber.validator';
import { EmailIdvalidators } from '../../../../core/ui-components/validators/emailid/emailid.validator';

export class UserProfileValidator {
    modalFormGroup: FormGroup;
    personalDetailFormGroup: FormGroup;
    setPersonalFormValidator(personalDetailFormGroup) {
        this.personalDetailFormGroup = personalDetailFormGroup;
        this.personalDetailFormGroup.get('zipcode').setValidators(Validators.compose([Validators.maxLength(6)]));
        this.personalDetailFormGroup.get('addressLine1').setValidators(Validators.compose([Validators.maxLength(50)]));
        this.personalDetailFormGroup.get('addressLine2').setValidators(Validators.compose([Validators.maxLength(50)]));
        this.personalDetailFormGroup.get('user_mobile').setValidators(Validators.compose([Validators.maxLength(15)]));
        this.personalDetailFormGroup.get('user_phone').setValidators(Validators.compose([Validators.maxLength(8)]));
        return this.personalDetailFormGroup;
    }

    setModalFormGroupValidator(modalFormGroup){
        this.modalFormGroup=modalFormGroup;
        this.modalFormGroup.get('recoveryAnswer1').setValidators(Validators.compose([Validators.required]));
        this.modalFormGroup.get('recoveryAnswer2').setValidators(Validators.compose([Validators.required]));
        return this.modalFormGroup;
    }
}
