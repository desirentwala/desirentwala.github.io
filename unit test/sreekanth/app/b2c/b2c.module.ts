import { SharedModule } from '../core/shared/shared.module';
import { ProductLanding } from './b2c.productLanding';
import { B2cRoutingModule } from './b2c.routes';
import { B2CDashboard } from './b2c.dashboard';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/ncpapp.core.module';



@NgModule({
    imports: [
        B2cRoutingModule,
        CoreModule,
        SharedModule
    ],
    declarations: [B2CDashboard, ProductLanding],
    exports: [SharedModule]
})
export class AllB2CModules { }