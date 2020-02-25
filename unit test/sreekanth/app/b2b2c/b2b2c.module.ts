import { SharedModule } from '../core/shared/shared.module';
import { B2B2CProductLandingComponent } from './b2b2c.productLanding';
import { B2b2cRoutingModule } from './b2b2c.routes';
import { B2B2CProductComponent } from './products/b2b2c.product';
//import { B2B2CDashboard } from './b2b2c.dashboard';
import { CommonModule } from '@angular/common';
import { UiMiscModule } from '../core/ui-components/misc-element/misc.component';
import { UiButtonModule } from '../core/ui-components/button/button.component';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/ncpapp.core.module';
import { NavbarModule, UserProfileModule, MenubarModule, BreadcrumbModule, BannerModule } from '../modules/common/index';
import { FooterModule } from '../modules/common/footer/index';
import { B2B2CHeaderModule } from '../modules/common/b2b2c/header/header';


@NgModule({
    imports: [B2b2cRoutingModule, CoreModule, CommonModule, SharedModule, UiMiscModule,
        CoreModule,UserProfileModule, SharedModule, NavbarModule, MenubarModule, FooterModule, BreadcrumbModule, BannerModule,
        B2B2CHeaderModule],
    declarations: [B2B2CProductLandingComponent, B2B2CProductComponent],
    exports: [B2B2CProductLandingComponent, B2B2CProductComponent]

})
export class B2B2CProductModule { }