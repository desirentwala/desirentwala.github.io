import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VetPracticePageRoutingModule } from './vet-practice-routing.module';
import { VetDashboardPage } from './vet-dashboard/vet-dashboard.page';
import { VetAppointmentsPage } from './vet-appointments/vet-appointments.page';
import { BaseRoutePage } from './base-route/base-route.page';
import { CommonPageModule } from '../common/common.module';
import { VetProfilePage } from './vet-profile/vet-profile.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VetPracticePageRoutingModule,
    CommonPageModule,
  ],
  declarations: [BaseRoutePage, VetDashboardPage, VetAppointmentsPage,
    VetProfilePage
  ]
})
export class VetPracticePageModule { }
