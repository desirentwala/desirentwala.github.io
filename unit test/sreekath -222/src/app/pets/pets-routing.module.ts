import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewPage } from './view/view.page';
import { ListPage } from './list/list.page';
import { NewPage } from './new/new.page';
import { BaseroutePage } from './baseroute/baseroute.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { BookingsPage } from './bookings/bookings.page';
import { AppointmentsPage } from './appointments/appointments.page';
import { PoProfilePage } from './po-profile/po-profile.page';
import { UserGuard } from '../common/services/auth-guards/user-guard.service';
const routes: Routes = [
  {
    path: '',
    component: BaseroutePage,
    // canActivate: [UserGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ListPage,
      },
      {
        path: 'new',
        component: NewPage
      },
      {
        path: 'edit',
        component: NewPage
      },
      {
        path: 'view',
        component: ViewPage
      },
      {
        path: 'dashboard',
        component: DashboardPage
      },
      {
        path: 'bookings',
        component: BookingsPage
      },
      {
        path: 'appointments',
        component: AppointmentsPage
      },
      {
        path: 'profile',
        component: PoProfilePage
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsPageRoutingModule { }
