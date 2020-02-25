import { JoinPipe } from './common/pipes/joinPipe';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { NgDashboardModule } from '@adapters/packageAdapter';

import { CoreModule } from '../core/ncpapp.core.module';
import { SharedModule } from '../core/shared/shared.module';
import { UiMiscModule } from '../core/ui-components/misc-element/misc.component';
import { ChartModule } from '../core/ui-components/ncpCharts/ncpChart.component';
import { AllRouteModule } from './all.routes';
import { BannerModule, BreadcrumbModule, MenubarModule, NavbarModule } from './common';
import { B2B2CHeaderModule } from './common/b2b2c/header/header';
import { NavbarModuleB2C } from './common/b2c/navbar/navbar';
import { Dashboard } from './common/dashboard/index';
import { RenewalModule } from './common/enquiry/renewal/renewal.module';
import { FaqComponent } from './common/faq/faq.compontent';
import { FavoriteModule } from './common/favorite';
import { FooterModule } from './common/footer';
import { AllNotificationComponent } from './common/navbar/userNotification/allNotification';
import { UserProfileModule, UserprofileComponent } from './common/navbar/userProfileView/userProfileView';
import { NewsDashboardComponent } from './common/news-dashboard/news-dashboard.component';
import { ReportComponent } from './common/reports/report.component';
import { termsAndConditionsComponent } from './common/termsAndConditions/terms.component';
import { CountryRoutes } from './countryModule';
import { DynamicModules } from './dynamic-loader/dynamic.module';
import { provideRoutes } from '@angular/router';
import { RouteProvider } from './dynamic-loader/routes/route-provider';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NCPFormModule } from '../core/ncp-forms/ncp.forms.module';
@NgModule({
    imports: [
        AllRouteModule,
        CoreModule,
        UserProfileModule, SharedModule, NavbarModule, MenubarModule, FooterModule, BreadcrumbModule, BannerModule,
        NavbarModuleB2C, B2B2CHeaderModule, ChartModule, FavoriteModule, NgDashboardModule, UiMiscModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
          }), RenewalModule,CountryRoutes, DynamicModules],
    declarations: [Dashboard, FaqComponent, termsAndConditionsComponent
        , AllNotificationComponent, NewsDashboardComponent, ReportComponent,JoinPipe],
    exports: [Dashboard, FaqComponent, termsAndConditionsComponent
        , AllNotificationComponent, NewsDashboardComponent, ReportComponent,CountryRoutes],
    entryComponents: [Dashboard, FaqComponent, termsAndConditionsComponent, AllNotificationComponent, ReportComponent, UserprofileComponent],
    providers: [provideRoutes(RouteProvider.getModuleRoutes())]

})
export class AllModules { }