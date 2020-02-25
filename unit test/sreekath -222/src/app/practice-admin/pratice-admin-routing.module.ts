import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseRoutePage } from './base-route/base-route.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { ViewPage } from './view/view.page';
import { VetListPage } from './vet-list/vet-list.page';
import { CustomerPage } from './customer/customer.page';
import { AddnewVetPage } from './addnew-vet/addnew-vet.page';
import { PaAppointmentsPage } from './pa-appointments/pa-appointments.page';
import { PracticeAdminGuard } from '../common/services/auth-guards/practice-admin-guard.service';
import { PaProfilePage } from './pa-profile/pa-profile.page';
import { PaSettingsPage } from './pa-settings/pa-settings.page';

const routes: Routes = [
  {
    path: '',
    component: BaseRoutePage,
    // canActivate: [PracticeAdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardPage
      },
      {
        path: 'appointments',
        component: PaAppointmentsPage
      },
      {
        path: 'slotscheduling',
        component: VetListPage
      },
      {
        path: 'view',
        component: ViewPage
      },
      {
        path: 'customer',
        component: CustomerPage
      },
      {
        path: 'addnewvet',
        component: AddnewVetPage
      },
      {
        path: 'profile',
        component: PaProfilePage
      },
      {
        path: 'settings',
        component: PaSettingsPage
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PraticeAdminPageRoutingModule { }
