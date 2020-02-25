import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


import { VhdAdminPageRoutingModule } from './vhd-admin.routing.module';
import { VhdDashboardComponent } from './vhd-dashboard/vhd-dashboard.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { CommonPageModule } from '../common/common.module';
import { BaseRoutePage } from './base-route/base-route.component';
import { PracticerDetailsPage } from './practicer-details/practicer-details.page';
import { AddNewPracticerPage } from './add-new-practicer/add-new-practicer.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VhdTableComponent } from './vhd-table/vhd-table.component';
import { VhdPopoverComponent } from './vhd-table/vhd-popover/vhd-popover.component';
import { PracticerInfoComponent } from './practicer-info/practicer-info.component';
import { VhdProfilePage } from './vhd-profile/vhd-profile.page';
// import { EditVetPage } from './edit-vet/edit-vet.page';
// import { EditPetOwnerPage } from './edit-pet-owner/edit-pet-owner.page';
// import { EditPetPage } from './edit-pet/edit-pet.page';

@NgModule({
  declarations: [
    BaseRoutePage,
    VhdDashboardComponent,
    PracticeListComponent,
    AppointmentsListComponent,
    PracticerDetailsPage,
    AddNewPracticerPage,
    VhdTableComponent,
    PracticerInfoComponent,
    VhdPopoverComponent,
    VhdProfilePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VhdAdminPageRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    CommonPageModule,
  ],
  exports: [VhdPopoverComponent],
  entryComponents: [VhdPopoverComponent]
})
export class VhdAdminModule { }
