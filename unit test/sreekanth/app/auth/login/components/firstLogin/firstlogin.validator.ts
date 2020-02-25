import { FormGroup, Validators } from '@angular/forms';
export class firstLoginValidator {
    firstloginForm: FormGroup;   
    createNewUserFormGroup: FormGroup;

    setnewpasswordValidator(createNewUserFormGroup) {
        this.createNewUserFormGroup = createNewUserFormGroup;    
        this.createNewUserFormGroup.get('user_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));
        this.createNewUserFormGroup.get('confirm_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));    
        this.createNewUserFormGroup.get('recoveryQuestion1_code').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryQuestion1_desc').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryAnswer1').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryQuestion2_code').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryQuestion2_desc').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryAnswer2').setValidators(Validators.compose([Validators.required]));
        
        return this.createNewUserFormGroup;
    }

    passwordMismatch(userPwd, confirmPwd) {
        if (userPwd !== confirmPwd) {
            return true;
        } else {
            return false;
        }
    }
}