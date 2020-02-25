
import { ConfigService } from '../../core/services/config.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { UserService } from '../login/services/user/user.service';
import { LoginFormModel } from '../login/model/login-model';
import { Logger } from '../../core/ui-components/logger/logger';

@Component({
  selector: 'thirdpartylogin-component',
  template: ``
})

export class ThirdPartyLoginComponent {
    configure: ConfigService;
    _userService: UserService;
    isExternalUser;
    pathname;
    loginForm;
    logger;
    thirdPartySiginError: any = {};
    constructor(config: ConfigService, userService: UserService, loginFormModel: LoginFormModel,  logger: Logger) {
        this.configure = config;
        this._userService = userService;
        this.loginForm = loginFormModel.getLoginFormModel();
        this.logger = logger;
        this.configure.loggerSub.subscribe(data => {
            if (data === 'configLoaded') {
                this.getTokenForAuthentication();
            }
        });
    }

    getTokenForAuthentication() {
        let getThirdPartySigninId =  () => {
            let thirdPartySigninId = null;
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
                if (key === 'id') {
                    thirdPartySigninId = value;
                    return thirdPartySigninId;
                }
            });
            return thirdPartySigninId;
        };
        if (getThirdPartySigninId() !== null && getThirdPartySigninId() !== '' && getThirdPartySigninId() !== undefined) {
            let credentials = this.loginForm.value;
            credentials.third_party_signin_id = getThirdPartySigninId();
            this._userService.validateLoginByTheThirdParty(credentials, this.isExternalUser, this.pathname);
        } else {
            this.thirdPartySiginError.errorType = 'thirdPartySiginError';
            this.thirdPartySiginError.errCode = 204;
            this.thirdPartySiginError.errDesc = 'NCPLabel.thirdPartySigninErrorUserNotRegistered';
            this.configure.setCustom('thirdPartySiginError', this.thirdPartySiginError);
            this.logger.info('NCPLabel.thirdPartySigninErrorUserNotRegistered');
            this.configure._router.navigate(['/Login']);
        }
    }
}
@NgModule({
  declarations: [ThirdPartyLoginComponent],
  imports: [CommonModule],
  exports: [ThirdPartyLoginComponent],
  providers: [UserService, LoginFormModel]
})
export class ThirdPartyLoginModule { 

}