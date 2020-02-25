import { SharedService } from '../../../../core/shared/shared.service';
import { B2B2CServices } from '../../../../b2b2c/services/b2b2c.service';
import { ConfigService } from '../../../../core/services/config.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { Logger } from '../../../../core/ui-components/logger';
import { MenuService } from '../../menubar/services/menu.service';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
/**
 * This class represents the navigation bar component.
 */
@Component({

  selector: 'b2b2c-ncp-header',
  templateUrl: './header.html'

})
export class B2B2CHeader implements AfterContentInit {
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
  brandingJson = [];
  partnerJson = [];
  constructor(public logger: Logger, public _menuService: MenuService,
    router: Router, _config: ConfigService
    , public b2b2cService: B2B2CServices, shared: SharedService) {
    this.router = router;
    this.showDashboard = true;
    this.previousLevel = [];
    this.isUserAccountMenuFlag = false;
    this.configure = _config;
    this.loginUserName = this.configure.getCustom('user_name');
    this.isMenuOpenFlag = false;
    if (this.configure.getCustom('cobranding')) {
      this.configure.setLoadingSub('yes');
      this.brandingJson = this.configure.getCustom('cobranding')['header'];
      this.partnerJson = this.configure.getCustom('cobranding')['partnerLogo'];
    }
    if (this.configure.getCustom('menu')) {
      this.menujsondata = this.configure.getCustom('menu');
    } else {
      let menuresponse = this._menuService.getMasterMenuJson();
      menuresponse.subscribe((menuData) => {
        this._menuService.setMenuJson(menuData[0]);
        let menuJosn = this._menuService.get('menus');
        this.menujsondata = menuJosn;
        this.configure.setCustom('menu', this.menujsondata);
      });
    }
  }
  ngAfterContentInit() {
    this.b2b2cService.chunkingSub.subscribe((data) => {
      if (data) {
        this.configure.setLoadingSub('yes');
        this.brandingJson = data['header'];
        this.partnerJson = data['partnerLogo'];
      }
    });
  }

  navigateRouterLink(routerUrl: any) {
    this.configure.navigateRouterLink(routerUrl);
  }
  navigateRouterMenu(menu) {
    if (menu.url !== '' && menu.url !== null) {
      let mainNavBarDivId = document.getElementById('mainNavBar');
      mainNavBarDivId.style.marginBottom = 0 + 'px';
      let user_id = this.configure.getCustom('user_id');
      if (menu.ssoLogin && user_id) {
        menu.url += '/?user=' + user_id;
      }
      if (menu.isExternal && menu.targetBlank) {
        window.open(menu.url);
      } else if (menu.isExternal && !menu.targetBlank) {
        location.replace(menu.url);
      } else {
        this.configure.navigateRouterLink(menu.url);
      }
    }
  }
  changeLevel(item) {
    this.previousLevel.push(this.menujsondata);
    this.menujsondata = item;
    this.showDashboard = false;
  }
  goBack() {
    if (this.isUserAccountMenuFlag) {
      if (this.menujsondata === this._menuService.get('menus'))
        this.showDashboard = true;
      this.isUserAccountMenuFlag = false;
    }
    else {
      this.menujsondata = this.previousLevel.pop();
      if (this.menujsondata === this._menuService.get('menus')) {
        this.previousLevel.splice(0, this.previousLevel.length);
        this.showDashboard = true;
      }
    }

  }
  toggleMenu(event) {
    if (event.target.checked) {
      this.menujsondata = this._menuService.get('menus');
      this.showDashboard = true;
      this.isUserAccountMenuFlag = false;
      this.isMenuOpenFlag = true;
      this.scrollDisable();
    } else {
      this.isMenuOpenFlag = false;
      this.scrollEnable();
    }
  }
  showUserAccountMenu() {
    this.isUserAccountMenuFlag = true;
    this.showDashboard = false;
  }
  closeMenu() {
    let spinnerForm = document.getElementById('spinner-form');
    spinnerForm['checked'] = false;
    this.isMenuOpenFlag = false;
    this.scrollEnable();
  }
  scrollDisable() {
    if (this.isScrollDisabled) {
      return;
    }
    this.scrollTop = document.body.scrollTop;

    if (document.body.classList) {
      document.body.classList.add('scrolDisabled');
    }
    // else{
    //   document.body['scrolDisabled'] += ' ' + 'scrolDisabled'; 
    // }
    document.body.style.top = '' + (-1 * this.scrollTop);
    this.isScrollDisabled = true;
  }

  scrollEnable() {
    if (!this.isScrollDisabled) {
      return;
    }
    if (document.body.classList) {
      document.body.classList.remove('scrolDisabled');
    }
    document.body.scrollTop = this.scrollTop;
    this.isScrollDisabled = false;
  }
}

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [B2B2CHeader],
  exports: [B2B2CHeader]
})





export class B2B2CHeaderModule { }
