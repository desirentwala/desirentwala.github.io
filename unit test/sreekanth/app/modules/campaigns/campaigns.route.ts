import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsComponent } from './campaigns.component';
import { CampaignDetailComponent } from './campaignDetail/campaignDetail.component';

const routes: Routes = [
  { path: '', component: CampaignsComponent},
  { path: 'campaignDetails', component: CampaignDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignsRoutingModule { }

