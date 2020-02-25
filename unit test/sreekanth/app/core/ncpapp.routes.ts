import { PostPaymentHandlerComponent } from './../modules/common/postPaymentHandler/postPaymentHandler.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/gaurd';
import { LanguageComponent } from '../auth/language/language.component';
import { LoginComponent } from '../auth/login';
import { AllB2B2CComponents } from '../b2b2c/all.b2b2c.component';
import { AllB2CComponents } from '../b2c/all.b2c.component';
import { AllComponents } from '../modules';
import { environment } from '../../environments/environment';
import { ThirdPartyLoginComponent } from '../auth/thirdpartylogin/thirdpartylogin.component';
import { ResetPasswordComponent } from '../auth/login/components/resetPassword/resetPassword.component';
export const routes: Routes = [
  { path: '', redirectTo: 'Language', pathMatch: 'full' },
  { path: 'FirstLogin', component: AllComponents },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Language', component: LanguageComponent },
  { path: 'ncp', component: AllComponents, loadChildren: 'app/modules/all.modules#AllModules', canActivate: [AuthGuard] },
  { path: 'b2c', component: AllB2CComponents, loadChildren: 'app/b2c/b2c.module#AllB2CModules' },
  { path: 'b2b2c', component: AllB2B2CComponents, loadChildren: 'app/b2b2c/b2b2c.module#B2B2CProductModule', canActivate: [AuthGuard] },
  { path: 'paymentRedirect', component: PostPaymentHandlerComponent },
  { path: 'se', loadChildren: 'app/screenEditor/screenEditor.module#ScreenEditorModule' },
  { path: 'thirdPartyLogin', component: ThirdPartyLoginComponent },
  { path: '**', redirectTo: 'Login', pathMatch: 'full' }
];
// Always Screen Configurator route to be in the last but one. Don't move it

if (!environment.enableScreenConfigurator) {
  let i = routes.findIndex(element => {
    if (element['path'] === 'se') {
      return true;
    } else {
      return false;
    }
  });
  routes.splice(i, 1);
}


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class NcpAppRoutes { }




