import { FormGroup, Validator, Validators } from '@angular/forms';
export class LoginValidator {
    loginForm: FormGroup;
    passwordRecoveryForm: FormGroup;
    resetPasswordForm: FormGroup;
    createNewUserFormGroup: FormGroup;
    enterOTPForm: FormGroup;

    setLoginValidator(loginForm) {
        this.loginForm = loginForm;
        this.loginForm.get('user_id').setValidators(Validators.compose([Validators.required, Validators.minLength(6)]));
        this.loginForm.get('user_password').setValidators(Validators.required);
        return this.loginForm;
    }
    setEnterOTPValidator(enterOTPForm) {
        this.enterOTPForm = enterOTPForm;
        this.enterOTPForm.get('user_OTP').setValidators(Validators.required);
        return this.enterOTPForm;
    }
    setPasswordRecoveryValidator(passwordRecoveryForm) {
        this.passwordRecoveryForm = passwordRecoveryForm;
        this.passwordRecoveryForm.get('recoveryAnswer1').setValidators(Validators.required);
        this.passwordRecoveryForm.get('recoveryAnswer2').setValidators(Validators.required);
        return this.passwordRecoveryForm;
    }

    setResetPasswordValidator(resetPasswordForm) {
        this.resetPasswordForm = resetPasswordForm;
        this.resetPasswordForm.get('user_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));
        this.resetPasswordForm.get('confirm_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));
        return this.resetPasswordForm;
    }

    setnewpasswordValidator(createNewUserFormGroup) {
        this.createNewUserFormGroup = createNewUserFormGroup;
        this.createNewUserFormGroup.get('current_password').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryQuestion1_code').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryQuestion1_desc').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryAnswer1').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryQuestion2_code').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryQuestion2_desc').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('recoveryAnswer2').setValidators(Validators.compose([Validators.required]));
        this.createNewUserFormGroup.get('user_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));
        this.createNewUserFormGroup.get('confirm_password').setValidators(Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$')]));
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
