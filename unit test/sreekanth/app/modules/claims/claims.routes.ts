import { NgModule } from '@angular/core';
import { ClaimsComponent } from './claims.component';
import { FnolComponent } from './fnol/fnol.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: ClaimsComponent, data: { 'momentType': 'FT' } },
  { path: 'FNOL', component: FnolComponent, data: { 'momentType': 'FT' } },
  { path: 'FNOLOpenHeld', component: FnolComponent, data: { 'momentType': 'FT' } },
  { path: 'FNOLEnquiry', component: FnolComponent, data: { 'momentType': 'FT' } },
  { path: 'FNOLNotifyClaim', component: FnolComponent, data: {  'momentType': 'FT' } },

  { path: 'NTNewClaim', component: FnolComponent, data: { 'momentType': 'NT' } },
  { path: 'NTOpenHeld', component: FnolComponent, data: { 'momentType': 'NT' } },
  { path: 'NTEnquiry', component: FnolComponent, data: { 'momentType': 'NT' } },
  { path: 'NTNotifyClaim', component: FnolComponent, data: { 'momentType': 'NT'} }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimRoutingModule { }



