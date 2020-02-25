import { B2B2CServices } from '../../../../b2b2c/services/b2b2c.service';
import { ConfigService } from '../../../../core/services/config.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { SharedService } from '../../../../core/shared/shared.service';
import { Logger } from '../../../../core/ui-components/logger';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, NgModule } from '@angular/core';
import { LocalStorageService } from '@adapters/packageAdapter';
import { UiMiscModule } from '../../../../core/ui-components/misc-element/misc.component';
import { ChatBotModule } from '../..';
/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'ncp-footercontact',
  templateUrl: './footerContact.html'
})

export class Footercontact implements AfterContentInit {

  versionJson = 'null';
  currentYear;
  brandingJson = [];
  b2b2cFlag: boolean = false;
  constructor(public logger: Logger, public configService: ConfigService,
    public utilsService: UtilsService,
    public b2b2cService: B2B2CServices, public shared: SharedService, public localStorage: LocalStorageService) {
    if (!this.configService.getCustom('b2b2cFlag')) {
      let brandJsonData = this.configService.getCustom('branding');
      if (!brandJsonData) {
        this.configService.loggerSub.subscribe((data) => {
          if (data === 'brandingLoaded') {
            brandJsonData = this.configService.getCustom('branding');
            this.setFooterDetails(brandJsonData);
          }
        });
      } else {
        this.setFooterDetails(brandJsonData);
      }

    } else {
      if (this.configService.getCustom('cobranding')) {
        this.brandingJson = this.configService.getCustom('cobranding')['footerContact'];
      }
    }
    if(this.configService._config['buildVersion']){
       this.versionJson = this.configService._config['buildVersion'];
    }
    if (this.configService.getCustom('b2b2cFlag') || this.configService.getCustom('b2cFlag')) {
      this.b2b2cFlag = true;
    }
    let date = new Date();
    this.currentYear = date.getUTCFullYear();
  }

  setFooterDetails(brandUrl) {
    this.brandingJson = brandUrl['footerContact'];
  }

  gotToTermsAndConditions() {
    this.configService.navigateRouterLink('ncp/termsandConditions');
  }
  ngAfterContentInit() {
    if (this.configService.getCustom('b2b2cFlag')) {
      this.b2b2cService.chunkingSub.subscribe((data) => {
        if (data) {
          this.brandingJson = data['footerContact'];
        }
      });
    }
  }
}

@NgModule({
  declarations: [Footercontact],
  imports: [CommonModule, SharedModule, UiMiscModule, ChatBotModule],
  exports: [Footercontact]
})
export class FootercontactModule { }


