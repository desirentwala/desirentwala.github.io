import { ProductDetailsService } from './../../modules/product/services/product.service';
import { SharedService } from '../../core/shared/shared.service';
import { UserService } from '../../auth/login';
import { ConfigService } from '../../core/services/config.service';
import { BreadCrumbService } from '../../modules/common';
import { QuotService } from '../../modules/transaction/services/quote.service';
import { B2B2CServices } from '../services/b2b2c.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Http } from '@angular/http';



@Component({
    templateUrl: './b2b2c.product.html'
})
export class B2B2CProductComponent {
    public products: any;
    public lobCode: string;
    constructor(
        public configService: ConfigService,
        public http: Http,
        public breadCurmbService: BreadCrumbService,
        public changeRef: ChangeDetectorRef,
        public b2b2cService: B2B2CServices,
        public quoteService: QuotService,
        public userService: UserService,
        shared: SharedService,
        public productService: ProductDetailsService) {
        this.breadCurmbService.addRouteName('/b2b2c/product', [{ 'name': this.b2b2cService.getLobCode() }]);

        let productResonse = this.configService.getJSON({ key: 'META', path: 'products' });
        productResonse.subscribe((productData) => {
            if (productData !== null || productData !== undefined) {
                this.lobCode = this.b2b2cService.getLobCode();
                this.products = productData[this.lobCode];
                this.configService.setLoadingSub('no');
            }
        });
        this.changeRef.markForCheck();
    }

    gotoProductDetails(productDetailsCode) {
        window.scroll(0, 0);
        this.productService.setproductCode(productDetailsCode);
        this.configService.navigateRouterLink('ncp/product/productDetails');
    }
    getQuote(productCode) {
        let queryParams = { productCode: productCode, eventType: 'NQ', transactionType: 'QT' };
        let routeUrl = this.quoteService.getLOBRoute(productCode);
        if (routeUrl) {
            this.configService.navigateRouterLink(routeUrl, queryParams);
        }else {
            this.quoteService.loadedSub.subscribe(() => {
                routeUrl = this.quoteService.getLOBRoute(productCode);
                this.configService.navigateRouterLink(routeUrl, queryParams);
            });
        }
    }
}
