import { AllModules } from './../all.modules';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/ncpapp.core.module';
import { SharedModule } from '../../core/shared/shared.module';
import { UiMiscModule } from '../../core/ui-components/misc-element/misc.component';
import { EnquiryModule } from '../common/enquiry/enquiry.module';
import { RenewalModule } from '../common/enquiry/renewal/renewal.module';
import { ActivityComponent } from './activity.component';
import { ActivityRoutingModule } from './activity.route';
import { PolicyMovementComponent } from "./policyActivity/policyMovement.component";
import { LoaderModule } from '../../core/ui-components/loader/loader';
@NgModule({
  imports: [
    CommonModule,
    ActivityRoutingModule,
    CoreModule,
    EnquiryModule, ReactiveFormsModule, SharedModule, UiMiscModule, RenewalModule, LoaderModule],
  exports: [ActivityComponent, PolicyMovementComponent],
  declarations: [ActivityComponent, PolicyMovementComponent],
  entryComponents: [ActivityComponent, PolicyMovementComponent]
})
export class ActivityModule { }
