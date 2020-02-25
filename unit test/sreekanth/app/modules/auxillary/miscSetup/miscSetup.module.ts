import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from '../../../core/index';
import { SharedModule } from './../../../core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { UiMiscModule } from '../../../core/ui-components/misc-element/misc.component';
import { MiscsetupRoutingModule } from './miscsetup.routes';
import { NewMiscSetupComponent } from './newMiscSetup/newMiscSetup.component';
import { MiscSetupService } from './services/miscsetup.service';
import { MiscSetupListComponent } from './miscSetupList/miscSetupList.component';
import { MiscSetupEditComponent } from './miscSetupEdit/miscSetupEdit.component';
import { MiscSetupFormComponent } from './miscSetupForm/miscSetupForm.component';


@NgModule({
  declarations: [NewMiscSetupComponent, MiscSetupListComponent, MiscSetupEditComponent, MiscSetupFormComponent],
  imports: [
    CommonModule,
    MiscsetupRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UiMiscModule
  ],
  providers: [MiscSetupService],
  exports: [NewMiscSetupComponent,MiscSetupListComponent,MiscSetupFormComponent,MiscSetupEditComponent],
  entryComponents:[NewMiscSetupComponent,MiscSetupListComponent,MiscSetupFormComponent,MiscSetupEditComponent]
})
export class MiscSetupModule { }
