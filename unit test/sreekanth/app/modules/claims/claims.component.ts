import { Component } from '@angular/core';
import { LocalStorageService } from '@adapters/packageAdapter';
import { SharedService } from '../../core/shared/shared.service';
import { BreadCrumbService } from '../common';
import { ConfigService } from './../../core/services/config.service';
@Component({
  selector: 'claims-template',
  templateUrl: './claims.component.html'
})
export class ClaimsComponent {
  claimFormPdf;
  claimsDetail;
  imgUrl;
  b2cOrB2b2cFlag: boolean = false;
  public config: ConfigService;
  constructor(public _config: ConfigService, shared: SharedService, public breadCurmbService: BreadCrumbService, public localStorage: LocalStorageService) {
    this.breadCurmbService.addRouteName('/ncp/claims', [{ 'name': 'NCPLabel.claims' }]);
    this.config = _config;
    _config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.getLanguage();
      }
    });
    this.getLanguage();
    this.config.setLoadingSub('no');
  }

  getLanguage() {
    window.scroll(0, 0);
    let filePath;
    filePath = 'assets/claims/ClaimLanding.json';
    let claimsDetail = this.config.ncpJsonCall(filePath);
    claimsDetail.subscribe((claimsDetailResponse) => {
      this.claimsDetail = claimsDetailResponse;
      this.imgUrl = this.claimsDetail[0].imgUrl;
      this.claimFormPdf = this.claimsDetail[0].claimFormPdf;
    });
  }
  public navigateRoute() {
    let movementType = this.config.get('movementType');
    let navigateFNOL: any = '';
    if (movementType === 'NT') {
      navigateFNOL = 'ncp/claims/NTNotifyClaim';
    } else {
      navigateFNOL = 'ncp/claims/FNOLNotifyClaim';
    }
    this.config.navigateRouterLink(navigateFNOL);
    window.scrollTo(0, 0);
  }
}
