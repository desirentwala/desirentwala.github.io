import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetsPageRoutingModule } from './pets-routing.module';
import { CommonPageModule } from '../common/common.module';
import { ViewPage } from './view/view.page';
import { ListPage} from './list/list.page';
import { NewPage} from './new/new.page';
import { BaseroutePage } from './baseroute/baseroute.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { BookingsPage } from './bookings/bookings.page';
import { AppointmentsPage } from './appointments/appointments.page';
import { PoProfilePage } from './po-profile/po-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPageModule,
    PetsPageRoutingModule
  ],
  declarations: [
    ViewPage,
    ListPage,
    NewPage,
    BookingsPage,
    AppointmentsPage,
    BaseroutePage,
    DashboardPage,
    PoProfilePage,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PetsPageModule {}
