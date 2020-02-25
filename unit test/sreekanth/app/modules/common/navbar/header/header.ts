import { UserService } from '../../../../auth/login/services/user/user.service';
import { ConfigService } from '../../../../core/services/config.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { SharedService } from '../../../../core/shared/shared.service';
import { Logger } from '../../../../core/ui-components/logger';
import { MenuService } from '../../menubar/services/menu.service';
import { NotificationServices } from '../userNotification/services/userNotification.service';
import { UsernotificationModule } from '../userNotification/userNotification';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { PickList } from '../../models/picklist.model';
import { DataSyncModule } from '../dataSynv/dataSync.component';
/**
 * This class represents the navigation bar component.
 */
@Component({

  selector: 'ncp-header',
  templateUrl: './header.html'

})
export class Header implements AfterContentInit {
  headerLogoLink;
  router;
  showDashboard: boolean;
  previousLevel: Array<any>;
  isUserAccountMenuFlag: boolean;
  loginUserName: any;
  isMenuOpenFlag: boolean = false;
  isScrollDisabled: boolean = false;
  scrollTop;
  configure;
  menujsondata: Array<any>;
  brandingJson = [];
  userGrp: string = '';
  notificationCount: string = '';
  productList: Array<any>;
  isB2CFlag: boolean = false;
  isExpanded: boolean = false;
  isCollapsed: boolean = true;
  isCollapse: boolean = false;
  isCollapsing: boolean = false;
  userGroupPickList = new PickList();
  roleId: string = '';

  constructor(public logger: Logger, public _menuService: MenuService, router: Router, _config: ConfigService, public notificationServices: NotificationServices, shared: SharedService, public userService: UserService) {
    this.router = router;
    this.showDashboard = true;
    this.previousLevel = [];
    this.isUserAccountMenuFlag = false;
    this.configure = _config;
    this.loginUserName = this.configure.getCustom('user_name');
    this.isMenuOpenFlag = false;
    this.userGrp = this.configure.getCustom('user_prf_group_code');
    this.productList = this.configure.getCustom('product_list');
    this.roleId = this.configure.getCustom('roleId');
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
    // let menuresponse = this._menuService.getMasterMenuJson();
    //  menuresponse.subscribe((data) => {
    //    this._menuService.setMenuJson(data);
    //   let menuJosn = this._menuService.get('menus');
    //   this.menujsondata = menuJosn;
    //  });
    this.notificationServices.countEventEmitter.subscribe((count) => {
      if (count) {
        this.notificationCount = count;
      } else {
        this.notificationCount = '';
      }
    });

    this.userGroupPickList.auxType = 'UsersUG';
    this.userGroupPickList.param1 = String(this.configure.getCustom('user_id'));
    let userGroupListResponse = this.configure.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.userGroupPickList);
    userGroupListResponse.subscribe((userGroupListData) => {
      if (userGroupListData && !userGroupListData.error) {
        this.configure.setCustom('userGroups',userGroupListData)
      }
    });
  }
  ngOnInit(){
    this.configure.loggerSub.subscribe((data) => {
      if (data === 'brandingLoaded') {
        let brandJsonData = this.configure.getCustom('branding');
        if(brandJsonData)this.setHeaderDetails(brandJsonData);
      }
    });
  }
  setHeaderDetails(brandUrl) {
    this.brandingJson = brandUrl['header'];
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
        if (menu.productCode !== undefined) {
          let queryParams = {};
          queryParams = { productCode: menu.productCode, eventType: 'NQ', transactionType: 'QT' };
          this.configure.navigateRouterLink(menu.url, queryParams);
        }
        else this.configure.navigateRouterLink(menu.url);
      }
    }
  }
  navigateRouterLink(routeURL) {
    this.configure.navigateRouterLink(routeURL);
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
toggle() {
    if (this.isExpanded) {
        this.hide();
    } else {
        this.show();
    }
}
hide() {
  setTimeout(() => {
      this.isCollapse = true;
      this.isCollapsing = true;
  }, 4);
  this.isExpanded = false;
  this.isCollapsed = true;
}

show() {
  setTimeout(() => {
      this.isCollapse = false;
  }, 4);
  this.isCollapsing = false;
  this.isExpanded = true;
  this.isCollapsed = false;
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
  isDisplayMenu(productCode, isProductCheck) {
    if (isProductCheck) {
      if (this.productList === null || this.productList === undefined) {
        return true;
      } else {
        let lenOfProduct = this.productList.length;
        for (let i = 0; i < lenOfProduct; i++) {
          // tslint:disable-next-line:curly
          if (this.productList[i].code === productCode) return true;
        }
        return false;
      }
    }
    return true;

  }
  showUserAccountMenu() {
    this.isUserAccountMenuFlag = true;
    this.showDashboard = false;
  }
  closeMenu() {
    let spinnerForm = document.getElementById('spinner-form');
    spinnerForm['checked'] = false;
    this.isMenuOpenFlag = false;
    document.getElementById("notificationOverlay").style.display = 'none';
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

  ngAfterContentInit() {
    this.isB2CFlag = this.configure.getCustom('b2cFlag');
    this.notificationServices.countEventEmitter.subscribe((count) => {
      if (count) {
        this.notificationCount = count;
      } else {
        this.notificationCount = '';
      }
    });
    this.notificationServices.notificationModalOpen.subscribe((data) => {
      if (data === 'opened') {
        this.closeMenu();
        document.getElementById("notificationOverlay").style.display = 'block';
        let modalOverLayss = document.getElementsByClassName("modal-backdrop");
        for (let i = 0; i < modalOverLayss.length; i++) {
          if ((<HTMLElement>modalOverLayss[i])) {
            (<HTMLElement>modalOverLayss[i]).style.display = "none"
          }
        }
      } else if (data === 'close') {
        this.closeMenu();
      }
    });
  }
  logoutUser() {
    this.userService.logoutUser();
  }
  navigateHome() {
    this.configure.navigateToHome();
  }
}

@NgModule({
  imports: [CommonModule, SharedModule, UsernotificationModule,DataSyncModule],
  declarations: [Header],
  exports: [Header]
})





export class HeaderModule { }
