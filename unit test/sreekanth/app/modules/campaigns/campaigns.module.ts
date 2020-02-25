import { CoreModule } from '../../core/ncpapp.core.module';
import { SharedModule } from '../../core/shared/shared.module';
import { CampaignsComponent } from './campaigns.component';
import { CampaignDetailComponent } from './campaignDetail/campaignDetail.component';
import { CampaignsRoutingModule } from './campaigns.route';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    CampaignsRoutingModule,
    ReactiveFormsModule, SharedModule],
  declarations: [CampaignsComponent, CampaignDetailComponent],
  exports: [CampaignsComponent, CampaignDetailComponent],
  entryComponents: [CampaignsComponent, CampaignDetailComponent]
})
export class CampaignsModule { }