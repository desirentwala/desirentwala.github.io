import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { VHDAdminGuard } from './common/services/auth-guards/VHD-admin-guard.service';
import { VetGuard } from './common/services/auth-guards/vet-guard.service';
import { PracticeAdminGuard } from './common/services/auth-guards/practice-admin-guard.service';
import { UserGuard } from './common/services/auth-guards/user-guard.service';
import { AuthGuard } from './common/services/auth-guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule),
  },
  {
    path: 'pets',
    loadChildren: () => import('./pets/pets.module').then(m => m.PetsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'online-consultation',
    loadChildren: () => import('./online-consultation/online-consultation.module').then(m => m.OnlineConsultationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'practiceadmin',
    loadChildren: () => import('./practice-admin/pratice-admin.module').then(m => m.PraticeAdminPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vetpractice',
    loadChildren: () => import('./vet-practice/vet-practice.module').then(m => m.VetPracticePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vhdadmin',
    loadChildren: () => import('./vhd-admin/vhd-admin.module').then(m => m.VhdAdminModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
