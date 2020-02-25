import { Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { SharedService } from '../../../core/shared/shared.service';
import { NcpCarouselModule } from '../../../core/ui-components/ncp-carousel/ncp.carousel';
import { FavoriteService } from '../services/favorite.service';
import { ProductDetailsService } from './../../product/services/product.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from '@adapters/packageAdapter';
import { SharedModule } from '../../../core/shared/shared.module';
import{ UiMiscModule } from '../../../core/ui-components/misc-element/misc.component'
@Component({
  selector: 'favorite-FavoriteComponent',
  templateUrl: './favoriteTemplate.html',
  providers: [LocalStorageService, FavoriteService]
  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class FavoriteComponent implements OnInit {
  @Input() label:any;
  showFavFlag: boolean = false;
  allProducts = [];
  allProductsFin: any = [];
  localstorage: any;
  favoriteService;
  favToDisplay = [];
  config;
  owl;
  finalFavorite;
  userLang;
  showNavButton: boolean = true;
  showFavoritePanel: boolean;
  constructor(public productDetailsService: ProductDetailsService, _localStorageService: LocalStorageService, _config: ConfigService, shared: SharedService, favoriteService: FavoriteService, private changeRef: ChangeDetectorRef) {
    this.localstorage = _localStorageService;
    this.favoriteService = favoriteService;
    this.config = _config;
  }


  ngOnInit() {
    // this.favoriteService.initLocalStorage();
    // this.favoriteService.allProductFinal.subscribe(() => {
      let getDataByBuild;
      this.finalFavorite = this.favoriteService.finalFavorite;
      this.allProducts = this.favoriteService.utilsServices.getProductDetails();
      if (this.allProducts.length > 0) this.doProcessFavouriteProducts();
      else {
        this.favoriteService.utilsServices.loadedSub.subscribe(() => {
          this.allProducts = this.favoriteService.utilsServices.productRouteArray;
          this.doProcessFavouriteProducts();
        });
      }
    // });
  }



  navigateGetQuote(productCode) {
    let queryParams = { productCode: productCode, eventType: 'NQ', transactionType: 'QT',isFromProductScreen:true};
    let routeUrl = this.favoriteService.utilsServices.getLOBRoute(productCode);
    this.config.navigateRouterLink(routeUrl, queryParams);
  }
  navigateProductFullDetails(productCode) {
    window.scroll(0, 0);
    this.config.setLoadingSub('yes');
    let build = this.config.get('build');
    this.productDetailsService.setproductCode(productCode);
    this.config.navigateRouterLink('/ncp/product/productDetails');
  }

  viewAllProducts() {
    window.scroll(0, 0);
    this.config.navigateRouterLink('/ncp/product');
  }

  getOwlElement(event) {
    this.owl = event;
  }

  prev() {
    this.owl.trigger('prev.owl.carousel');
  }
  next() {
    this.owl.trigger('next.owl.carousel', [300]);
  }

    public doProcessFavouriteProducts() {
      this.finalFavorite = this.favoriteService.finalFavorite;
      this.allProducts = this.favoriteService.utilsServices.getProductDetails();
      let favToDisplayLength = this.finalFavorite.length;
      let allProductsLength = this.allProducts.length;
      let mostPopular =  this.localstorage.get('NCP.Favorite.clicked_names');
      for (var j = 0; j < favToDisplayLength; j++) {
        for (var i = 0; i < allProductsLength; i++) {
          if (this.allProducts[i].productName === this.finalFavorite[j]) {
            this.allProductsFin.push(this.allProducts[i]);
          }
        }
      }
      if(mostPopular !== null){
        for(let i= 0;i<mostPopular.length;i++){
          for(let j= 0;j<this.allProducts.length;j++){
            if(mostPopular[i] === this.allProducts[j].productCode && !this.allProductsFin.includes(this.allProducts[j])){
              this.allProductsFin.push(this.allProducts[j]);
            }
          }
        }
        if(mostPopular.length < 4){
          for(let i=0; i<this.allProducts.length; i++){
            if(!this.allProductsFin.includes(this.allProducts[i])){
                this.allProductsFin.push(this.allProducts[i]);
            }
          }
        }
      }else{
        for(let i=0; i<this.allProducts.length; i++){
          if(!this.allProductsFin.includes(this.allProducts[i])){
              this.allProductsFin.push(this.allProducts[i]);
          }
        }
      }
    if (this.allProductsFin.length <= 3) {
        this.showNavButton = false;
      }
      this.showFavFlag = true;
  }

}

@NgModule({
  imports: [CommonModule, NcpCarouselModule, SharedModule, UiMiscModule],
  exports: [FavoriteComponent],
  declarations: [FavoriteComponent]
})
export class FavoriteModule { }
