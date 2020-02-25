import { ProductDetailsService } from './../modules/product/services/product.service';
import { ConfigService } from '../core/services/config.service';
import { SharedService } from '../core/shared/shared.service';
import { BreadCrumbService } from '../modules/common';
import { QuotService } from '../modules/transaction/services/quote.service';
import { B2B2CServices } from './services/b2b2c.service';
import { AfterContentInit, Component } from '@angular/core';

@Component({
    templateUrl: './b2b2c.productLanding.html'
})
export class B2B2CProductLandingComponent implements AfterContentInit {
    public products: string;
    sessionFlag: boolean = false;
    constructor(public configService: ConfigService,
        public breadCurmbService: BreadCrumbService,
        public b2b2cService: B2B2CServices,
        public quoteService: QuotService,
        shared: SharedService,
        public productService: ProductDetailsService
    ) {
        this.breadCurmbService.addRouteName('/b2b2c/productLanding', [{ 'name': 'NCPBreadCrumb.products' }]);
        let productResonse = this.configService.getJSON({ key: 'META', path: 'lineOfBusiness' });
        productResonse.subscribe((productData) => {
            if (productData !== null || productData !== undefined) {
                this.products = productData.LOB;
            }
        });
        this.sessionFlag = true;
        this.configService.setLoadingSub('no');
    }
    ngAfterContentInit() {
        this.b2b2cService.chunkingSub.subscribe((data) => {
            if (data)
                this.configService.setLoadingSub('no');
        });
    }
    gotoProduct(lob) {
        window.scroll(0, 0);
        this.b2b2cService.setLobCode(lob);
        this.configService.navigateRouterLink('/b2b2c/product');
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
    gotoProductDetails(productDetailsCode, lob) {
        window.scroll(0, 0);
        this.productService.setproductCode(productDetailsCode);
        this.b2b2cService.setLobCode(lob);
        this.configService.navigateRouterLink('ncp/product/productDetails');
    }
}
