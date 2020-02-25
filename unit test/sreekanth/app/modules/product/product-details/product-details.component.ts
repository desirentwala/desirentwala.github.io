import { LocalStorageService } from '@adapters/packageAdapter';
import { SharedService } from '../../../core/shared/shared.service';
import { ProductDetailsService } from './../services/product.service';
import { ConfigService } from './../../../core/services/config.service';
import { BreadCrumbService } from './../../common/breadCrumb/services/breadcrumb.service';
import { QuotService } from './../../transaction/services/quote.service';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';

@Component({
  selector: 'product-details',
  templateUrl: './product-details.template.html'
})
export class ProductDetailsComponent implements OnInit {

  showRelatedFlag: boolean = false;
  productCode;
  productDetail;
  env;
  product;
  imgSrc;
  annualPlan: boolean;
  singleTrip: boolean;
  b2cFlag: boolean = false;
  b2b2cFlag: boolean = false;
  showRelatedProductFlag: boolean = false;
  utilsServices: UtilsService;

  constructor(public configService: ConfigService,
    public breadCurmbService: BreadCrumbService,
    public productDetails: ProductDetailsService,
    public quoteService: QuotService,
    shared: SharedService,
    public localStorageService: LocalStorageService,
    _utilsServices: UtilsService) {
    this.breadCurmbService.addRouteName('/ncp/product/productDetails', [{ 'name': 'NCPBreadCrumb.product', redirectUrl: '/ncp/product' }, { 'name': 'NCPBreadCrumb.productDetails' }]);
    let lang = this.localStorageService.get('User_lang');
    this.utilsServices = _utilsServices;

    if (Object.keys(this.utilsServices.productKeyMap).length > 0) this.getProductDetails(lang);
    else {
      this.utilsServices.doFetchProductData();
      this.utilsServices.loadedSub.subscribe(() => {
        this.getProductDetails(lang);
      });
    }
    let brandJsonData = this.configService.getCustom('branding');
    if (!brandJsonData) {
      this.configService.loggerSub.subscribe((data) => {
        if (data === 'brandingLoaded') {
          brandJsonData = this.configService.getCustom('branding');
          this.setImgDetails(brandJsonData);
        }
      });
    } else {
      this.setImgDetails(brandJsonData);
    }
  }

  setImgDetails(brandJsonData) {
    let imgSrc = brandJsonData.product.travel.imgURL;
    this.imgSrc = imgSrc;
  }

  ngOnInit() {
    // this.configService.loggerSub.subscribe((data) => {
    //   if (data === 'langLoaded') {
    //     let lang = this.localStorageService.get('User_lang');
    //     this.getProductDetails(lang);
    //   }
    // });

    if (this.configService.getCustom('b2b2cFlag')) {
      this.b2b2cFlag = true;
    } else if (this.configService.getCustom('b2cFlag')) {
      this.b2cFlag = true;
    }
  }

  getProductDetails(lang) {
    // let productResonse = this.configService.ncpJsonCall('assets/products/favoriteProducts/products-details' + lang + '.json');
    // this.utilsServices.loadedSub.subscribe((datava) => {
    this.env = this.productDetails.getEnvCode();
    this.productCode = this.productDetails.getProductCode();
    this.product = this.utilsServices.get(this.utilsServices.productKeyMap[this.productCode][0])[this.utilsServices.productKeyMap[this.productCode][1]]['DETAILS'];
    if (this.product.features) {
      if ((!this.product.features.SingleTrip || this.product.features.SingleTrip.length < 1) && (!this.product.features.AnnualPlan || this.product.features.AnnualPlan.length < 1)) {
        this.singleTrip = false;
        this.annualPlan = false;
      }
      else {
        this.singleTrip = true;
        this.annualPlan = true;
      }
    }
    for (let i = 0; i < this.product.relatedProducts.length; i++) {
      if (this.b2b2cFlag || this.b2cFlag) {
        if (this.b2cFlag) {
          if (this.product.relatedProducts[i].b2cFlag === 'true') {
            this.showRelatedProductFlag = true;
          }
        }
        if (this.b2b2cFlag) {
          if (this.product.relatedProducts[i].b2b2cFlag === 'true') {
            this.showRelatedProductFlag = true;
          }
        }

      } else {
        this.showRelatedProductFlag = true;
      }

    }
    this.configService.setLoadingSub('no');
    // });
  }

  getQuote(productCode) {
    window.scroll(0, 0);
    let queryParams = { productCode: productCode, eventType: 'NQ', transactionType: 'QT',isFromProductScreen:true };
    let routeUrl = this.utilsServices.getLOBRoute(productCode);
    if (routeUrl) {
      this.configService.navigateRouterLink(routeUrl, queryParams);
    }
  }
  goToRelatedProduct(productCode) {
    this.productDetails.setproductCode(productCode);
    this.getProductDetails(this.localStorageService.get('User_lang'));
    window.scroll(0, 0);
  }
}
