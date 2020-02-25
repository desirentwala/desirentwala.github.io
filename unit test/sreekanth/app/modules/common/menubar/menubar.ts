import { ConfigService } from '../../../core/services/config.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { FavoriteService } from '../../../modules/common/services/favorite.service';
import { MenuService } from './services/menu.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '@adapters/packageAdapter';
// import { ROUTER_DIRECTIVES } from '@angular/router';
import { TranslateService } from '@adapters/packageAdapter';
import { SharedService } from '../../../core/shared/shared.service';

@Component({

  selector: 'ncp-menubar',
  templateUrl: './menubar.html',
  providers: [FavoriteService]
})
export class Menubar implements OnInit {
  showStyle: boolean = false;
  showChildStyle: boolean = false;
  _menujsondata: Array<any>;
  productList: Array<any>;
  privousDivId: any = '';
  privousChildDivId: any = '';
  defaultFocusLiId: any = '';
  router;
  favoriteService;
  activeMenuItemID: string = '0001';
  user_name;
  menuDisplayType: any = 'OnClick';
  localstorage;
  clicksFavorite = [];
  menuState: string = 'out';
  isB2CFlag: boolean = false;
  constructor(public _menuService: MenuService,
    router: Router,
    _favoriteService: FavoriteService,
    public configService: ConfigService,
    _localStorage: LocalStorageService,
    public changeRef: ChangeDetectorRef,
    public translate: TranslateService,
    public shared: SharedService) {

    this.router = router;
    this.favoriteService = _favoriteService;
    this.localstorage = _localStorage;
    if (this.configService.getCustom('menu')) {
      this._menujsondata = this.configService.getCustom('menu');
    } else {
      let menuresponse = this._menuService.getMasterMenuJson();
      menuresponse.subscribe((menuData) => {
        if (menuData) {
          this._menuService.setMenuJson(menuData[0]);
          let menuJosn = this._menuService.get('menus');
          this._menujsondata = menuJosn;
          this.configService.setCustom('menu', this._menujsondata);
        }
      });
    }

  }
  ngOnInit() {
    this.configService.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.configService.currentLangName);
      }
    });
    this.isB2CFlag = this.configService.getCustom('b2cFlag');
    this.productList = [];
    this.productList = this.configService.getCustom('product_list');
    if (this.configService.get('menuDisplayType')) {
      this.menuDisplayType = this.configService.get('menuDisplayType');
    }
  }
  isDisplayMenu(productCode, isProductCheck) {
    if (isProductCheck) {
      if (this.productList === null || this.productList === undefined) {
        return true;
      } else {
        let lenOfProduct = this.productList.length;
        if (lenOfProduct > 0) {
          for (let i = 0; i < lenOfProduct; i++) {
            // tslint:disable-next-line:curly
            if (this.productList[i].code === productCode) return true;
          }
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }
  showSubMenu() {
    if (this.showChildStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
  closeRootSubMenu(parmId: any) {
    this.toggleMenu('close');
    this.showStyle = false;
    let currentDivId = document.getElementById(parmId);
    if (currentDivId !== null && currentDivId.style.display === 'block') {
      currentDivId.style.display = 'none';
    }
    let mainNavBarDivId = document.getElementById('mainNavBar');
    mainNavBarDivId.style.marginBottom = 0 + 'px';
  }


  showRootSubMenu(parmId: any) {
    this.toggleMenu('open');
    this.showStyle = true;
    if (this.defaultFocusLiId && this.defaultFocusLiId.style.background) {
      this.defaultFocusLiId.style.background = 'rgba(0, 0, 0, 0)';
    }

    let currentDivId = document.getElementById(parmId);
    let currentSubDivId = document.getElementById(parmId + '-01');
    if (this.privousDivId !== null && this.privousDivId !== '' && this.privousDivId.style.display === 'block') {
      this.showChildStyle = false;
      this.privousDivId.style.display = 'none';
    }

    if (this.showStyle) {

      if (this.privousChildDivId !== null && this.privousChildDivId !== '' && this.privousChildDivId.style.display === 'block') {
        this.privousChildDivId.style.display = 'none';
      }
      let mainNavBarDivId = document.getElementById('mainNavBar');
      this.showChildStyle = true;
      currentDivId.style.display = 'block';
      let defaultFocusDivId = currentDivId.children[1];
      if (defaultFocusDivId.hasChildNodes) {
        this.defaultFocusLiId = defaultFocusDivId.firstElementChild.firstElementChild.firstElementChild;
        this.defaultFocusLiId.style.background = 'rgba(103, 133, 193, 0.3)';
      }

      currentSubDivId.style.display = 'block';
      currentSubDivId.style.marginLeft = 0 + 'px';
      // currentSubDivId.style.top = -15 + 'px';
      let product_drop = document.getElementById(parmId);
      if (currentDivId.clientHeight > currentSubDivId.clientHeight) {
        // product_drop.style.height = 0 + currentDivId.clientHeight + 'px';
        mainNavBarDivId.style.marginBottom = currentDivId.clientHeight + 'px';
      } else {
        // product_drop.style.height = 55 + currentSubDivId.clientHeight + 'px';
        mainNavBarDivId.style.marginBottom = 80 + currentSubDivId.clientHeight + 'px';
      }
      this.privousChildDivId = currentSubDivId;
    } else {
      currentDivId.style.display = 'none';
    }
    this.privousDivId = currentDivId;
  }
  showSubMenuofChild(childParmId: any) {
    this.showChildStyle = true;
    let currentDivId = document.getElementById(childParmId);
    let clickFocusLiId = document.getElementById(childParmId + 1);
    if (this.privousChildDivId !== null && this.privousChildDivId !== '' && this.privousChildDivId.style.display === 'block') {
      this.privousChildDivId.style.display = 'none';
      this.defaultFocusLiId.style.background = '#ffffff';
    }
    let mainNavBarDivId = document.getElementById('mainNavBar');
    let product_drop = document.getElementById(this.activeMenuItemID);
    if (this.showChildStyle) {
      currentDivId.style.display = 'block';
      clickFocusLiId.style.background = 'rgba(103, 133, 193, 0.3)';
      if (currentDivId.clientHeight > this.privousDivId.clientHeight) {
        mainNavBarDivId.style.marginBottom = 50 + currentDivId.clientHeight + 'px';
      } else {
        mainNavBarDivId.style.marginBottom = this.privousDivId.clientHeight + 'px';
      }

      currentDivId.style.marginLeft = 0 + 'px';
      // currentDivId.style.top = -15 + 'px';
      this.showChildStyle = false;
    } else {
      currentDivId.style.display = 'none';
    }
    this.defaultFocusLiId = clickFocusLiId;
    this.privousChildDivId = currentDivId;
  }

  watchProductsOnclick(name) {
    this.favoriteService.favorite_watchProductsOnclick(name);
  }
  navigateRouterLink(menu) {
    if (menu.url !== '' && menu.url !== null) {
      if (this.privousDivId !== null && this.privousDivId !== '' && this.privousDivId.style.display === 'block') {
        this.privousDivId.style.display = 'none';
      }
      let mainNavBarDivId = document.getElementById('mainNavBar');
      mainNavBarDivId.style.marginBottom = 0 + 'px';
      let user_id = this.configService.getCustom('user_id');
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
          this.configService.navigateRouterLink(menu.url, queryParams);
        }
        else this.configService.navigateRouterLink(menu.url);
      }
    }
  }
  watchforclick(procode) {
    if (procode) {
      this.addToMostViewed(procode);
    }
  }
  addToMostViewed(name) {
    let clicksFav = [];
    let clicksFavArray = [];
    this.clicksFavorite = this.localstorage.get('NCP.Favorite.clicked_names');
    if (!this.clicksFavorite) {
      this.clicksFavorite = [];
    }
    this.clicksFavorite.push(name);
    var obj: Object = {};
    for (var i = 0, j = this.clicksFavorite.length; i < j; i++) {
      obj[this.clicksFavorite[i]] = (obj[this.clicksFavorite[i]] || 0) + 1;
    }
    let keys: Array<any> = Object.keys(obj);
    keys.forEach(ele => {
      let temp = {
        name: ele,
        count: obj[ele]
      }
      clicksFav.push(temp);
    });
    clicksFav = clicksFav.sort((a, b) => {
      return b.count - a.count;
    });
    for (let i = 0; i < clicksFav.length; i++) {
      clicksFavArray.push(clicksFav[i].name);
    }
    this.localstorage.set('NCP.Favorite.clicked_names', clicksFavArray);
  }
  toggleMenu(state) {
    // 1-line if statement that toggles the value:
    if (state === 'open') {
      this.menuState = 'in';
    }
    if (state === 'close') {
      this.menuState = 'out';
    }
    // if (this.menuState === 'out') {
    //   this.menuState = 'in';
    // } else {
    //   this.menuState = 'out';
    //    this.closeRootSubMenu(mainmenusid);
    // }
  }

  // + Menu Item Highlighting
  // activateSelectedMenu() {
  //  // let prevActiveMenuItem = document.getElementsByClassName('activeMenuItem');
  // //  let currentProductDrop = document.getElementById(this.activeMenuItemID);
  // //  let activeMenuItem = (<HTMLInputElement>currentProductDrop.parentNode);
  // //  for (let p = 0; p < prevActiveMenuItem.length; p++) {
  // //    if (prevActiveMenuItem[p].classList) {
  //       //  if (activeMenuItem == prevActiveMenuItem[p]) prevActiveMenuItem[p].classList.add('active');
  //       //   else prevActiveMenuItem[p].classList.remove('active');
  //  //   }
  //  // }
  // }

}

@NgModule({
  declarations: [Menubar],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [Menubar]
})
export class MenubarModule { }