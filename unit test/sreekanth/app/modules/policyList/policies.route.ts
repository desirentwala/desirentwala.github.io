import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PoliciesComponent } from './policies/policies.component';

const routes: Routes = [
  { path: '', component: PoliciesComponent },
  { path: 'policies', component: PoliciesComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoliciesRoutingModule { }



