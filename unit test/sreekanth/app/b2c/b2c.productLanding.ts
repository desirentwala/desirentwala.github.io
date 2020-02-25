import { ProductDetailsService } from './../modules/product/services/product.service';
import { SharedService } from '../core/shared/shared.service';
import { UserService } from '../auth/login';
import { ConfigService } from '../core/services/config.service';
import { BreadCrumbService } from '../modules/common';
import { QuotService } from '../modules/transaction/services/quote.service';
import { B2CServices } from './service/b2c.service';
import { Component } from '@angular/core';


@Component({
    templateUrl: './b2c.ProductsLanding.html'
})

export class ProductLanding {
    public products: string;
    public LOBName: string = '';
    constructor(public configService: ConfigService,
        public breadCurmbService: BreadCrumbService,
        public quoteService: QuotService,
        public b2cServices: B2CServices,
        public userService: UserService,
        SharedService: SharedService,
        public productService: ProductDetailsService) {
        this.breadCurmbService.addRouteName('/b2c/products',
            [{ 'name': 'Products' }]);
        let insuranceResponse = this.configService.getJSON({ key: 'META', path: 'insurance' });
        insuranceResponse.subscribe((insurance) => {
            if (insurance !== null || insurance !== undefined) {
                let insuranceType = insurance.insurance;
                this.LOBName = this.b2cServices.getInsuranceType();
                this.products = insurance[this.b2cServices.getInsuranceType()];
            }
        });
    }
    getQuote(productCode) {
        let routeUrl: any = this.quoteService.getLOBRoute(productCode);
        let queryParams = { productCode: productCode, eventType: 'NQ', transactionType: 'QT' };
        if (routeUrl) {
            this.configService.navigateRouterLink(routeUrl, queryParams);
        } else {}
    }
    gotoProductDetails(productDetailsCode) {

        this.productService.setproductCode(productDetailsCode);
        this.configService.navigateRouterLink('ncp/product/productDetails');
        window.scroll(0, 0);
    }
}
