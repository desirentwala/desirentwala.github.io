import { environment } from '../../../../../environments/environment';
import { AllUiComponents } from './../../../../core/ui-components/all.uicomponents.module';
import { CoreModule } from './../../../../core/ncpapp.core.module';
import { LocalStorageService } from '@adapters/packageAdapter';
import { B2B2CServices } from '../../../../b2b2c/services/b2b2c.service';
import { AfterContentInit, Component, NgModule, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger';
import { SharedModule } from "../../../../core/ui-components/common/shared";

// import { ROUTER_DIRECTIVES } from '@angular/router';
import { SharedService } from '../../../../core/shared/shared.service';
import { TranslateService } from '@adapters/packageAdapter';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'ncp-footerlogo',
  templateUrl: './footerLogo.html'
})
export class Footerlogo implements AfterContentInit, OnInit {
  public utils;
  brandingJson = [];
  partnerJson = [];
  public config: ConfigService;
  b2b2cFlag: boolean = false;
  b2cFlag: boolean = false;
  translated: boolean = false;
  type: any = '';
  showLanguage: boolean = true;
  typeList: Object = {
    english: 'English'
  };
  constructor(_utils: UtilsService, _config: ConfigService, public translate: TranslateService, public logger: Logger, public b2b2cServices: B2B2CServices, public localStorage: LocalStorageService, public ref: ChangeDetectorRef, shared: SharedService) {
    this.utils = _utils;
    this.config = _config;
    if (this.config.getCustom('b2cFlag')) {
      this.b2cFlag = true;
    }
    if (!this.config.getCustom('b2b2cFlag')) {
      let brandJsonData = this.config.getCustom('branding');
      if (!brandJsonData) {
        this.config.loggerSub.subscribe((data) => {
          if (data === 'brandingLoaded') {
            brandJsonData = this.config.getCustom('branding');
            this.setFooterDetails(brandJsonData);
          }
        });
      } else {
        this.setFooterDetails(brandJsonData);
      }

    } else {
      if (this.config.getCustom('cobranding')) {
        this.b2b2cFlag = true;
        this.brandingJson = this.config.getCustom('cobranding')['footerLogo'];
        this.partnerJson = this.config.getCustom('cobranding')['partnerLogo'];
      }
    }
  }
  ngOnInit() {
    this.config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded' && !this.translated) {
        let userLangDesc = this.localStorage.get('User_lang_Desc');
        if (userLangDesc) {
          this.setType(userLangDesc);
        } else {
          this.setType('English');
        }
        this.translated = true;
      }
    });
    if (environment.country === 'sg') {
      this.showLanguage = false;
    }
    if (this.config.getCustom('b2cFlag')) {
      this.setType(this.localStorage.get('User_lang_Desc'));
    }
    if (this.config.getCustom('user_lang')) {
      if (this.brandingJson['language']) {
        this.brandingJson['language'].forEach(element => {
          if (element.langCode === this.config.getCustom('user_lang')) {
            this.setType(element.langDesc);
          }
        });
      }
    }
  }
  setType(type) {
    this.type = type;
    this.ref.markForCheck();
  }

  setFooterDetails(brandUrl) {
    this.brandingJson = brandUrl['footerLogo'];
  }


  navigateRouterLink(routerUrl: any) {
    this.config.navigateRouterLink(routerUrl);
  }


  changeLanguage(language: any, languageDesc: any) {
    this.localStorage.set('User_lang', language);
    this.localStorage.set('User_lang_Desc', languageDesc);

    if (this.config.getCustom('b2b2cFlag')) {
      let cobrandingData = this.config.getCustom('cobrandingData');
      let cobranding = cobrandingData[language];
      if (cobranding) {
        this.b2b2cServices.chunkingSub.next(cobranding);
        this.config.setCustom('cobranding', cobranding);
      }
    }

    this.translate.resetLang(language);
    this.translate.use(language);
    this.translate.reloadLang(language);
    this.translate.getTranslation(language);
    this.config.currentLangName = language;
    this.config.loggerSub.next('langLoaded');

  }

  ngAfterContentInit() {
    if (this.config.getCustom('b2b2cFlag')) {
      this.b2b2cServices.chunkingSub.subscribe((data) => {
        if (data) {
          this.b2b2cFlag = true;
          this.brandingJson = data['footerLogo'];
          this.partnerJson = data['partnerLogo'];
        }
      });
    }
  }
}



@NgModule({
  declarations: [Footerlogo],
  imports: [CommonModule, AllUiComponents, SharedModule],
  exports: [Footerlogo]
})
export class FooterlogoModule { }
