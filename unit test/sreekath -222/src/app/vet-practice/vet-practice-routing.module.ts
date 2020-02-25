import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VetDashboardPage } from './vet-dashboard/vet-dashboard.page';
import { VetAppointmentsPage } from './vet-appointments/vet-appointments.page';
import { BaseRoutePage } from './base-route/base-route.page';
import { VetProfilePage } from './vet-profile/vet-profile.page';
import { VetGuard } from '../common/services/auth-guards/vet-guard.service';

const routes: Routes = [
  {
    path: '',
    component: BaseRoutePage,
    // canActivate: [VetGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: VetDashboardPage
      },
      {
        path: 'appointments',
        component: VetAppointmentsPage
      },
      {
        path: 'profile',
        component: VetProfilePage
      }
    ]
  }


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetPracticePageRoutingModule { }
