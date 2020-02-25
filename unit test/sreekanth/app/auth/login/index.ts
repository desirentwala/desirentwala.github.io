export * from './services/user/user.service';
export * from './model/login-model';
export * from './components/login/login.validator';
export * from './components/login/login.component';

export * from './components/firstLogin/firstlogin.validator';
export * from './components/firstLogin/firstlogin.component';

import { UserService } from './services/user/user.service';
import { LoginFormModel } from './model/login-model';
import { LoginValidator } from './components/login/login.validator';
import { firstLoginValidator } from './components/firstLogin/firstlogin.validator';


const LOGIN_PROVIDERS = [UserService, LoginFormModel, LoginValidator,firstLoginValidator];

export {
  LOGIN_PROVIDERS
};
