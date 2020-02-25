import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfigService } from '../../core/services/config.service';
import { SharedService } from '../../core/shared/shared.service';
import { BreadCrumbService } from '../common/breadCrumb/index';
import { UtilsService } from "../../core/ui-components/utils/utils.service";
import { CampaignService } from './services/campaign.service';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.html',
  providers: [CampaignService]
})
export class CampaignsComponent {
  public campaigns: any = {
    'primary': [],
    'secondary': []
  };
  constructor(public config: ConfigService,
    sharedService: SharedService,
    public breadCrumbService: BreadCrumbService,
    public util: UtilsService,
    public campaignService: CampaignService
  ) {
    breadCrumbService.addRouteName('/ncp/campaigns', [{ 'name': 'Manage campaigns' }]);
    this.getAllCampaigns();
  }
  getAllCampaigns() {
    let campaignsData = this.campaignService.getAllCampaigns({});
    campaignsData.subscribe((campaigns) => {
      let index = 0;
      campaigns.forEach(element => {
        if (element['priority'] === 1) {
          this.campaigns['primary'] = element;
        } else {
          if (this.campaigns['secondary'][index] === undefined) this.campaigns['secondary'][index] = [];
          this.campaigns['secondary'][index].push(element);
          if (this.campaigns['secondary'][index].length % 2 === 0) index++;
        }
      });
      this.config.setLoadingSub('no');
    });
  }
  redirectToDetails(code: string): void {
    let campaignsData = this.campaignService.getCampaignDetailsByCode({"campaignCd" : code});
    campaignsData.subscribe((campaigns) => {
      this.config.setCustom('campaign', campaigns[0]);
      this.config.navigateRouterLink('ncp/campaigns/campaignDetails');
      this.config.setLoadingSub('no');
    })

  }
}
