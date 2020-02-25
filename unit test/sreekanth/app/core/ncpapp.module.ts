import { B2B2CHeaderModule } from './../modules/common/b2b2c/header/header';
import { PostPaymentHandlerComponent } from './../modules/common/postPaymentHandler/postPaymentHandler.component';
import { FirstLoginModule } from './../auth/login/components/firstLogin/firstlogin.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@adapters/packageAdapter';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleModule } from '@adapters/packageAdapter';

import { LanguageModule } from '../auth/language/language.component';
import { LoginModule } from '../auth/login/index';
import { AllB2CComponents } from '../b2c/all.b2c.component';
import { NavbarModuleB2C } from '../modules/common/b2c/navbar/navbar';
import { BreadcrumbModule } from '../modules/common/breadCrumb/index';
import { FooterModule } from '../modules/common/footer/index';
import { MenubarModule, NavbarModule, ShareReassignModule } from '../modules/common/index';
import { AllComponents } from '../modules/index';
import { BannerModule } from './../modules/common/banner/index';
import { NCPErrorModule } from './handlers/uiErrorHandler';
import { NcpApp } from './index';
import { InterceptorModule } from './interceptors/interceptor.module';
import { CoreModule } from './ncpapp.core.module';
import { NcpAppRoutes } from './ncpapp.routes';
import { LoaderModule } from './ui-components/loader/loader';
import { ThemeModule } from './ui-components/theme/theme.component';
import { ThirdPartyLoginModule } from '../auth/thirdpartylogin/thirdpartylogin.component';

import { AllB2B2CComponents } from '../b2b2c/all.b2b2c.component';
import { RedirectModule } from '../auth/redirect/redirect.component';
import { NCPWalkthroughElementModule } from './ncp-walkthrough/ncp.walkthrough.element.module';
import { ResetPasswordModule } from '../auth/login/components/resetPassword/resetPassword.component';


let languageModule = LanguageModule;

@NgModule({
	imports: [
		BrowserAnimationsModule,
		CommonModule,
		HttpClientModule,
		BrowserAnimationsModule,
		InterceptorModule,
		NCPErrorModule,
		NcpAppRoutes,
		CoreModule.start(), NavbarModule, MenubarModule, FooterModule, BreadcrumbModule, BannerModule, FirstLoginModule, LoginModule, ResetPasswordModule,
		LoaderModule, languageModule, RedirectModule, NavbarModuleB2C, NgIdleModule.forRoot(), ThemeModule, B2B2CHeaderModule, NCPWalkthroughElementModule, ShareReassignModule, ThirdPartyLoginModule],
	declarations: [
		NcpApp,
		AllComponents,
		AllB2CComponents,
		AllB2B2CComponents,
		PostPaymentHandlerComponent
	],
	bootstrap: [NcpApp]

})
export class NcpAppModule {
}

