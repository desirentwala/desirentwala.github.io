import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/ncpapp.core.module';
import { SharedModule } from '../../core/shared/shared.module';
import { UiMiscModule } from '../../core/ui-components/misc-element/misc.component';
import { PoliciesRoutingModule } from './policies.route';
import { PoliciesComponent } from './policies/policies.component';


@NgModule({
  imports: [
    CommonModule, PoliciesRoutingModule, CoreModule, ReactiveFormsModule, SharedModule, UiMiscModule],
  declarations: [PoliciesComponent],
  entryComponents: [PoliciesComponent]
})
export class PoliciesModule { }
