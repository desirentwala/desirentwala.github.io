import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VhdDashboardComponent } from './vhd-dashboard/vhd-dashboard.component';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { BaseRoutePage } from './base-route/base-route.component';
import { VHDAdminGuard } from '../common/services/auth-guards/VHD-admin-guard.service';
import { VhdProfilePage } from './vhd-profile/vhd-profile.page';
const routes: Routes = [
    {
        path: '',
        component: BaseRoutePage,
        // canActivate: [VHDAdminGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: VhdDashboardComponent
            },
            {
                path: 'practice',
                component: PracticeListComponent
            },
            {
                path: 'profile',
                component: VhdProfilePage
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VhdAdminPageRoutingModule { }
