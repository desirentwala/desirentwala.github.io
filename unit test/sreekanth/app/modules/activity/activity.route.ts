import { Routes, RouterModule } from '@angular/router';
import { ActivityComponent } from './activity.component';
import { NgModule } from '@angular/core';
import { PolicyMovementComponent } from "./policyActivity/policyMovement.component";

const routes: Routes = [
  { path: '', component: ActivityComponent },
  {path:'policyMove',component: PolicyMovementComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }



