
import { Injectable } from '@angular/core';
import { HttpClient } from '@adapters/packageAdapter'
import { throwError as observableThrowError, Observable ,  Subject } from '@adapters/packageAdapter';
import { LocalStorageService } from '@adapters/packageAdapter';
import { Logger } from '../../../core/ui-components/logger/logger';
import { ConfigService } from '../../../core/services/config.service';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { SharedService } from '../../../core/shared/shared.service';

@Injectable()
export class FavoriteService {

  yourfav = [];
  config;
  productRoute = [];
  productRouteArray = [];
  watchforproduct = [];
  watchForFavoritejson = [];
  localstorage;
  moreClickedProduct;
  finalFavProducts;
  public finalFavorite = [];
  allProducts;
  public allProductsFin = [];
  dsdata = [];
  utilsServices;
  public allProductFinal = new Subject();
  constructor(public _logger: Logger, _config: ConfigService, _localStorage: LocalStorageService, _utilsServices: UtilsService, shared: SharedService) {
    this.config = _config;
    this.localstorage = _localStorage;
    this.utilsServices = _utilsServices;
    this.initLocalStorage();
  }

  initLocalStorage() {
    this.watchForFavoritejson = this.utilsServices.getProductFavouriteClicks();
    let watchForProduct = this.localstorage.get('NCP.Favorite.clicks');
    if (watchForProduct == null) {
      this.localstorage.set('NCP.Favorite.clicks', this.watchForFavoritejson);
    }
    this.productRoute = this.utilsServices.getProductDetails();
    if (this.productRoute.length > 0) this.doFavouriteHandling()
    else {
      this.utilsServices.loadedSub.subscribe(() => this.doFavouriteHandling())
    }

  }

  getFinalFavorites() {
    let lang = this.localstorage.get('User_lang');
    this.finalFavProducts = [];
    let favoriteUsers = [];
    let FavoriteDefault = [];
    let favoriteClicks = [];
    FavoriteDefault = this.localstorage.get('NCP.Favorite.default');
    favoriteUsers = this.localstorage.get('NCP.Favorite.user');
    favoriteClicks = this.localstorage.get('NCP.Favorite.clicks_names');

    if (favoriteUsers != undefined && favoriteUsers != null && favoriteUsers.length >= 1) {
      favoriteUsers.reverse();
      let filteredClick = this.filterFavorite(favoriteClicks, favoriteUsers);
      this.finalFavProducts.push(...favoriteUsers);
      this.finalFavProducts.push(...filteredClick);

    }
    else {
      if (favoriteClicks != undefined && favoriteClicks != null && favoriteClicks.length >= 1) {
        this.finalFavProducts.push(...favoriteClicks);
        this.finalFavProducts = this.finalFavProducts.slice(0, 9);
      }
      else {
        let mostPopular =  this.localstorage.get('NCP.Favorite.clicked_names');
        let allProduct =  this.utilsServices.getProductDetails();
        let s =[];
           if(mostPopular!== null){
           for(let i= 0;i<mostPopular.length;i++){
            for(let j= 0;j<allProduct.length;j++){
              if(mostPopular[i] === allProduct[j].productCode){
                s.push(allProduct[j].productName);
              }
            }
          }
          mostPopular = s;
          this.finalFavProducts.push(...mostPopular);
        }else{this.finalFavProducts.push(...FavoriteDefault);}
        this.finalFavProducts = this.finalFavProducts.slice(0, 9);
      }
    }
    return this.finalFavProducts;
  }

  favorite_watchProductsOnclick(name) {
    let lang = this.localstorage.get('User_lang');
    this.watchforproduct = this.localstorage.get('NCP.Favorite.clicks');
    let h = this.watchforproduct;
    for (let i = 0; i < h.length; i++) {
      if (h[i].name === name) {
        h[i].clicks++;
        this.localstorage.set('NCP.Favorite.clicks', h);
      }
    }
    let backup = this.localstorage.get('NCP.Favorite.clicks');
    backup.sort(function (val1, val2) {
      return parseFloat(val2.clicks) - parseFloat(val1.clicks);
    });

    let backupLength = backup.length;
    let mostClicked = [];
    for (let i = 0; i < backupLength; i++) {
      mostClicked.push(backup[i].name);
    }
    this.localstorage.set('NCP.Favorite.clicks_names', mostClicked);
  }

  filterFavorite(myArray, toRemove) {
    myArray = myArray.filter(function (el) {
      return toRemove.indexOf(el) < 0;
    });
    return myArray;
  }

  getMostClickedProductNames() {
    let backup = this.localstorage.get('NCP.Favorite.clicks');
    backup.sort(function (val1, val2) {
      return parseFloat(val1.clicks) - parseFloat(val2.clicks);
    });
    backup.reverse();
    for (let i = 0; i < 9; i++) {
      this.moreClickedProduct.push(backup[i].name);
    }
    return this.moreClickedProduct;
  }

  public handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg);
    return observableThrowError(errMsg);
  }

  public doFavouriteHandling() {
    this.productRoute = this.utilsServices.getProductDetails();
    for (let i = 0; i < this.productRoute.length; i++) {
      if (this.productRouteArray.length < 9) {
        this.productRouteArray.push(this.productRoute[i].productName);
      }
    }
    let dashBoardPage = this.localstorage.get('NCP.Favorite.default');
    if (dashBoardPage == null) {
      this.localstorage.set('NCP.Favorite.default', this.productRouteArray);  /*We are updating the dashboard page with the value of X*/
    }
    let productPage = this.localstorage.get('NCP.Favorite.user');
    if (productPage == null) {
      this.localstorage.set('NCP.Favorite.user', this.yourfav);
    }
    let clicks_name = this.localstorage.get('NCP.Favorite.clicks_names');
    if (clicks_name == null) {
      this.localstorage.set('NCP.Favorite.clicks_names', this.yourfav);
    }

    this.finalFavorite = this.getFinalFavorites();
  }
}