import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInPage } from './sign-in/sign-in.page';
import { RegisterPage } from './register/register.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { OtpVerificationPage } from './otp-verification/otp-verification.page';
import { PracticeRegisterPage } from './practice-register/practice-register.page';
import { PracticeSelectionPage } from './practice-selection/practice-selection.page';

const routes: Routes = [
  {
    path: '',
    component: SignInPage
  },
  {
    path: 'signin',
    component: SignInPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordPage
  },
  {
    path: 'resetpassword',
    component: ResetPasswordPage
  },
  {
    path: 'otpverification',
    component: OtpVerificationPage
  },
  {
    path: 'practiceregister',
    component: PracticeRegisterPage
  }, {
    path: 'practiceselection',
    component: PracticeSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule { }
