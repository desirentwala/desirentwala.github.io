import { SharedService } from '../../../../../core/shared/shared.service';
import { MenuService } from '../../..';
import { B2CServices } from '../../../../../b2c/service/b2c.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { SharedModule } from '../../../../../core/shared/shared.module';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
/**
 * This class represents the navigation bar component.
 */
@Component({

  selector: 'b2c-ncp-header',
  templateUrl: './header.html'

})
export class HeaderB2C {
  headerLogoLink;
  router;
  showDashboard: boolean;
  previousLevel: Array<any>;
  isUserAccountMenuFlag: boolean;
  loginUserName: any;
  isMenuOpenFlag: boolean;
  isScrollDisabled: boolean = false;
  scrollTop;
  configure;
  menujsondata: Array<any>;
  menuList: any;
  brandingJson;
  constructor(public _menuService: MenuService, router: Router, _config: ConfigService, public b2cServices: B2CServices, shared: SharedService) {
    this.router = router;
    this.showDashboard = true;
    this.previousLevel = [];
    this.isUserAccountMenuFlag = false;
    this.configure = _config;
    this.loginUserName = this.configure.getCustom('user_name');
    this.isMenuOpenFlag = false;
    let brandJsonData = this.configure.getCustom('branding');
    if (!brandJsonData) {
      this.configure.loggerSub.subscribe((data) => {
        if (data === 'brandingLoaded') {
          brandJsonData = this.configure.getCustom('branding');
          this.setHeaderDetails(brandJsonData);
        }
      });
    } else {
      this.setHeaderDetails(brandJsonData);
    }

    let menuResp = this._menuService.getMasterMenuJson();
    menuResp.subscribe((data) => {
      let menuJson = data[0]['menus'];
      this.menuList = menuJson;
    });
  }
  navigateRouterLink(routerUrl: any) {
    this.configure.navigateRouterLink(routerUrl);
  }

  setHeaderDetails(brandUrl) {
    this.brandingJson = brandUrl['header'];
  }
  openNav() {
    document.getElementsByTagName("body")[0].setAttribute("class", "hideOverflow");
    document.getElementById("overlay").style.height = "100%";
    document.getElementById("openBtnId").style.display = 'none';
    document.getElementById("myNav").style.display = 'block';
    document.getElementById("closeBtnId").style.display = 'block';
  }
  closeNav() {
    document.getElementsByTagName("body")[0].removeAttribute("class");
    document.getElementById("overlay").style.height = "0%";
    document.getElementById("closeBtnId").style.display = 'none';
    document.getElementById("myNav").style.display = 'none';
    document.getElementById("openBtnId").style.display = 'block';
  }
  goToProduct(list) {
    this.closeNav();
    this.b2cServices.setInsuranceType(list.code);
    this.configure.navigateRouterLink(list.url);
  }
}
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [HeaderB2C],
  exports: [HeaderB2C]
})
export class HeaderModuleB2C { }
