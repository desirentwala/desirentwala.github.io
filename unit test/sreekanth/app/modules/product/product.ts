import { ConfigService } from '../../core/services/config.service';
import { SharedService } from '../../core/shared/shared.service';
import { UtilsService } from '../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from '../common/breadCrumb/index';
import { FavoriteService } from './../common/services/favorite.service';
import { QuotService } from './../transaction/services/quote.service';
import { ProductDetailsService } from './services/product.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@adapters/packageAdapter';
import { TranslateService } from '@adapters/packageAdapter';

@Component({
	selector: 'product-ProductComponent',
	templateUrl: './productTemplate.html'
})

export class ProductComponent implements OnInit {
	config;
	localstorage;
	productDetails;
	favDetail = [];
	localStorageValue;
	utilService: UtilsService;
	yourfav = [];
	clicksFavorite = [];
	clicksFavArray=[];
	userLang;
	isproductCategoriescheked: boolean = true;
	productCategoryCheckedArray: any = {};
	mostPopular: any = [];
	lob: any = [];
	constructor(public quoteService: QuotService,public translate: TranslateService, public favoriteService: FavoriteService, public productDetailsService: ProductDetailsService, _localStorage: LocalStorageService, breadCrumbService: BreadCrumbService, _config: ConfigService, shared: SharedService, public utilsServices: UtilsService) {
		breadCrumbService.addRouteName('/ncp/product', [{ 'name': 'NCPBreadCrumb.products' }]);
		this.localstorage = _localStorage;
		this.config = _config;
		this.utilService = utilsServices;
	}

	ngOnInit() {
		this.config.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.config.currentLangName);
            }
        });
		let lang = this.localstorage.get('User_lang');
		this.userLang = this.localstorage.get('User_lang');
		let build = this.config.get('build');
		this.getProductDetail();
		this.yourfav = this.localstorage.get('NCP.Favorite.user');
        this.onChange(1); 
		this.config.loggerSub.subscribe((data) => {
			if (data === 'langLoaded') {
				this.userLang = this.localstorage.get('User_lang');
				this.favoriteService.initLocalStorage();
				this.getProductDetail();
			}
		});
		this.lob = this.utilService.getLOBNames();
	}
	onChange(deviceValue) {
		if (deviceValue == 1) {
			this.favoriteService.getFinalFavorites();
			this.mostPopular = this.favDetail;
			let temp2=[];
			let temp = [];
			for(let i = 0; i<this.favDetail.length; i++){
                temp[i] =  this.utilService.getTranslated(this.favDetail[i].productCode );
			}
			temp.sort();
			for(let i = 0 ;i<temp.length;i++){
				for(let j = 0; j< this.mostPopular.length; j++){
					if(temp[i] === this.utilService.getTranslated(this.mostPopular[j].productCode)){
						temp2[i]=this.mostPopular[j];
					}
				}
			}
			this.mostPopular = temp2;
			this.isproductCategoriescheked = true;
		}
		if (deviceValue == 2) {
			this.mostPopular =  this.localstorage.get('NCP.Favorite.clicked_names');
			if(this.mostPopular !== null){
				let temp = [];
				for(let i= 0;i<this.mostPopular.length;i++){
					for(let j= 0;j<this.favDetail.length;j++){
						if(this.mostPopular[i] === this.favDetail[j].productCode){
							temp[i] = this.favDetail[j];
							break;
						}
					}
				}
				this.mostPopular = temp;
				if(this.mostPopular.length < 4){
					for(let i=0; i<this.favDetail.length; i++){
						if(!this.mostPopular.includes(this.favDetail[i])){
							this.mostPopular.push(this.favDetail[i]);
						}
					}
				}
			}else{
				this.mostPopular = this.favDetail;
			}
			this.isproductCategoriescheked = false;
		}
	}
    
	getProductDetail() {
		let userProductList = [];
		let build = this.config.get('build');
		let getdashboardlabel;
		// getdashboardlabel = this.config.ncpJsonCall('assets/products/favoriteProducts/product.json').subscribe((datava) => {
		this.favDetail = this.utilsServices.getProductDetails();
		if (this.favDetail && this.favDetail.length > 0) {
			this.favDetail.forEach((UserProductElement, Useri) => {
				let isProductChecked = true;
				this.productCategoryCheckedArray[UserProductElement.businessType] = isProductChecked;
			});
		} else {
			this.utilsServices.loadedSub.subscribe(() => {
				this.favDetail = this.utilsServices.getProductDetails();
				this.favDetail.forEach((UserProductElement, Useri) => {
					let isProductChecked = true;
					this.productCategoryCheckedArray[UserProductElement.businessType] = isProductChecked;
				});
				this.lob = this.utilService.getLOBNames();
				this.onChange(1); 
				this.utilsServices.loadedSub.observers.pop();
				this.config.setLoadingSub('no'); 
			});
		}
		// });
	}
	getQuote(productCode) {
		window.scroll(0, 0);
		let queryParams = { productCode: productCode, eventType: 'NQ', transactionType: 'QT', isFromProductScreen: true };
		let routeUrl = this.favoriteService.utilsServices.getLOBRoute(productCode);
		if (routeUrl) {
			this.config.navigateRouterLink(routeUrl, queryParams);
		}
	}

	navigateProductFullDetails(productCode) {
		window.scroll(0, 0);
		this.config.setLoadingSub('yes');
		let build = this.config.get('build');
		this.productDetailsService.setproductCode(productCode);
		this.config.navigateRouterLink('/ncp/product/productDetails');
	}
	addToFavorite(name, id) {
		let lang = this.localstorage.get('User_lang');
		if (this.yourfav.length > 16) {
			this.yourfav = this.localstorage.get('NCP.Favorite.user');
			this.yourfav.shift();
			this.yourfav.push(name);
			this.localstorage.set('NCP.Favorite.user', this.yourfav);
		}
		else {
			this.yourfav = this.localstorage.get('NCP.Favorite.user');
			this.yourfav.push(name);
			this.localstorage.set('NCP.Favorite.user', this.yourfav);
		}

		// let clicksFav = this.localstorage.get('NCP.Favorite.clicks');
		// clicksFav.sort(function (val1, val2) {
		// 	return parseFloat(val2.clicks) - parseFloat(val1.clicks);
		// });

		// let backupLength = clicksFav.length;
		// let mostClicked = [];
		// for (let i = 0; i < backupLength; i++) {
		// 	mostClicked.push(clicksFav[i].name);
		// }
		// this.localstorage.set('NCP.Favorite.clicks_names', mostClicked);
	}

	doRemoveFromFavoriteList(name) {
		this.yourfav = this.localstorage.get('NCP.Favorite.user');
		let yourFavIndex = this.yourfav.indexOf(name);
		this.yourfav.splice(yourFavIndex, 1);
		this.localstorage.set('NCP.Favorite.user', this.yourfav);
	}

	enableFavButton(productName) {

		let favPro = this.localstorage.get('NCP.Favorite.user');

		if (favPro.indexOf(productName) != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
}
