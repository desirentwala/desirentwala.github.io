import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PraticeAdminPageRoutingModule } from './pratice-admin-routing.module';
import { SchedulingManagementModule  } from '../scheduling-management/scheduling-management.module';
import { CommonPageModule } from '../common/common.module';

import { NewComponent } from './new/new.component';
import { ViewPage } from './view/view.page';
import { BaseRoutePage } from './base-route/base-route.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { VetListPage } from './vet-list/vet-list.page';
import { InviteUserPage } from './invite-user/invite-user.page';
import { ViewCustomerPage } from './view-customer/view-customer.page';
import { CustomerPage } from './customer/customer.page';
import { AddnewVetPage } from './addnew-vet/addnew-vet.page';
import { PaAppointmentsPage } from './pa-appointments/pa-appointments.page';
import { PaProfilePage } from './pa-profile/pa-profile.page';
import { PaSettingsPage } from './pa-settings/pa-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulingManagementModule,
    PraticeAdminPageRoutingModule,
    CommonPageModule
  ],
  declarations: [
    BaseRoutePage,
    PaSettingsPage,
    DashboardPage,
    VetListPage,
    NewComponent,
    ViewPage,
    InviteUserPage,
    CustomerPage,
    ViewCustomerPage,
    AddnewVetPage,
    PaAppointmentsPage,
    PaProfilePage,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class PraticeAdminPageModule { }
