import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CardPage } from '../common/components/card/card.page';
import { AppointmentConditionsPage } from './components/appointment-conditions/appointment.conditions.page';
import { SidebarPage } from '../common/components/sidebar/sidebar.page';
import { SidenavbarPage } from '../common/components/sidenavbar/sidenavbar.page';
import { ListbarPage } from './components/listbar/listbar.page';
import { PopupMenuComponent } from './components/popup-menu/popup-menu.component';
import { AppointmentCardComponent } from './components/appointment-card/appointment-card.component';
import { PopoverComponent } from './components/table/popover/popover.component';
import { TablePage } from './components/table/table.page';
import { CancelAppointmentPage } from './components/cancel-appointment/cancel-appointment.page';
import { LateJoinPage } from './components/late-join/late-join.page';
import { OnlynumberDirective } from './directives/allow-numbers';
import { CDVPhotoLibraryPipe} from '../common/pipes/cdvphotolibrary.pipe';
import { PhoneNumberDirective } from './directives/phone-number/phone-number.directive';
import { PreventSpaceDirective } from './directives/prevent-space';
import { ApptTypeTablePage } from './components/appt-type-table/appt-type-table.page';
import { EditVetPage } from './components/edit-vet/edit-vet.page';
import { EditPetOwnerPage } from './components/edit-pet-owner/edit-pet-owner.page';
import { EditPetPage } from './components/edit-pet/edit-pet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    OnlynumberDirective,
    CardPage,
    AppointmentConditionsPage,
    SidebarPage,
    SidenavbarPage,
    PopupMenuComponent,
    ListbarPage,
    AppointmentCardComponent,
    PopoverComponent,
    TablePage,
    CancelAppointmentPage,
    LateJoinPage,
    CDVPhotoLibraryPipe,
    PhoneNumberDirective,
    PreventSpaceDirective,
    ApptTypeTablePage,
    EditVetPage,
    EditPetOwnerPage,
    EditPetPage
  ],
  exports: [
    OnlynumberDirective,
    CardPage,
    AppointmentConditionsPage,
    SidebarPage,
    SidenavbarPage,
    PopupMenuComponent,
    ListbarPage,
    AppointmentCardComponent,
    PopoverComponent,
    TablePage,
    CancelAppointmentPage,
    LateJoinPage,
    CDVPhotoLibraryPipe,
    PhoneNumberDirective,
    PreventSpaceDirective,
    ApptTypeTablePage,
    EditVetPage,
    EditPetOwnerPage,
    EditPetPage
  ],
  entryComponents: [AppointmentConditionsPage, PopupMenuComponent, PopoverComponent],
})
export class CommonPageModule { }
