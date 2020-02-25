import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthPageRoutingModule } from './auth-routing.module';
import { SignInPage } from './sign-in/sign-in.page';
import { RegisterPage } from './register/register.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { OtpVerificationPage } from './otp-verification/otp-verification.page';
import { CommonPageModule } from '../common/common.module';
import { PracticeRegisterPage } from './practice-register/practice-register.page';
import { PracticeSelectionPage } from './practice-selection/practice-selection.page';
// import { Storage } from '@ionic/Storage';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthPageRoutingModule,
    CommonPageModule,
    // Storage
  ],
  declarations: [
    SignInPage,
    RegisterPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    OtpVerificationPage,
    PracticeRegisterPage,
    PracticeSelectionPage
],
schemas: [
  CUSTOM_ELEMENTS_SCHEMA
]
})
export class AuthPageModule {}
