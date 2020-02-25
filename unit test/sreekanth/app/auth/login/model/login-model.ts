import { FormGroup, FormControl } from '@angular/forms';

export class LoginFormModel {
    getLoginFormModel() {
        let loginForm = new FormGroup({
            user_id: new FormControl(),
            user_password: new FormControl(),
            user_lang_code: new FormControl(),
            user_branch: new FormControl(),
            user_name: new FormControl(),
            firstLogin: new FormControl(),
            token:new FormControl(),
            user_prf_group_code: new FormControl(),
            user_party_id: new FormControl(),
            product_list: new FormControl(),
            user_type: new FormControl(),
 			user_email: new FormControl(),
            currency_code: new FormControl(),
            sig_request: new FormControl(),
            userPermissions: new FormControl(),
            roleId: new FormControl(),
            user_agency_code: new FormControl(),
            systemRoleId : new FormControl(),
            country_code : new FormControl()
        });
        return loginForm;
    }

    getPasswordRecoveryFormModel() {
        let passwordRecoveryForm = new FormGroup({
            recoveryQuestion1_code: new FormControl(),
            recoveryQuestion2_code: new FormControl(),
            recoveryAnswer1: new FormControl(),
            recoveryAnswer2: new FormControl(),
            passwordRecoveryString: new FormControl()
        });
        return passwordRecoveryForm;
    }

    getResetPasswordFormModel() {
        let resetPasswordForm = new FormGroup({
            user_password: new FormControl(),
            confirm_password: new FormControl()
        });
        return resetPasswordForm;
    }

    getnNewUserCreationModel() {
        let createNewUserFormGroup = new FormGroup({
            user_id: new FormControl(),
            current_password: new FormControl(),
            user_password: new FormControl(),
            confirm_password: new FormControl(),
            recoveryQuestion1_code: new FormControl(),
            recoveryQuestion1_desc: new FormControl(),
            recoveryAnswer1: new FormControl(),
            recoveryQuestion2_code: new FormControl(),
            recoveryQuestion2_desc: new FormControl(),
            recoveryAnswer2: new FormControl(),
            recoveryString: new FormControl()
        });
        return createNewUserFormGroup;
    }
    getenterOTPFormGroupModel(){
        let enterOTPFormGroup = new FormGroup({
            user_OTP: new FormControl()            
        });
        return enterOTPFormGroup;
    }
    getForgotPasswordOptionsModel(){
        let forgotPasswordOptionFormGroup = new FormGroup({
            retrievePasswordBy: new FormControl()            
        });
        return forgotPasswordOptionFormGroup;
    }
}
