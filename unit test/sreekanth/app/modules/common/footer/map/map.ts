import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MultiLocationMapModule } from './multiLocationMap/multiLocationMap';
// import { ROUTER_DIRECTIVES } from '@angular/router';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'ncp-footermap',
  templateUrl: './map.html'
})
export class Map {
  brandingJson;
  trustedUrl;
  multiLocationMap: boolean = false;
  defaultLatitude: number = 0
  defaultLongitude: number = 0;
  radiusList: any[] = [];
  defaultLoactionAddress: string = '';
  constructor(public sanitizer: DomSanitizer, public logger: Logger, public configService: ConfigService, public utilsService: UtilsService) {
    let brandJsonData = this.configService.getCustom('branding');
    if (!brandJsonData) {
      this.configService.loggerSub.subscribe((data) => {
        if (data === 'brandingLoaded') {
          brandJsonData = this.configService.getCustom('branding');
          this.setMapDetails(brandJsonData);
        }
      });
    } else {
      this.setMapDetails(brandJsonData);
    }
  }

  setMapDetails(brandUrl) {
    this.brandingJson = brandUrl['map'];
    this.multiLocationMap = this.brandingJson['isMultiLocationMap'];
    this.defaultLongitude = this.brandingJson['multiLocationConfig']['currentLongitude'];
    this.defaultLatitude = this.brandingJson['multiLocationConfig']['currentLatitude'];
    this.radiusList = this.brandingJson['multiLocationConfig']['radiusList'];
    this.defaultLoactionAddress = this.brandingJson['multiLocationConfig']['currentAddress'];
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.brandingJson.iframe_src);
  }

}

@NgModule({
  declarations: [Map],
  imports: [CommonModule, MultiLocationMapModule],
  exports: [Map]
})
export class MapModule { }
