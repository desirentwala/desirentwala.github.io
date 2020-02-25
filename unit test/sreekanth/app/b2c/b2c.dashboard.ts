import { SharedService } from '../core/shared/shared.service';
import { B2CServices } from './service/b2c.service';
import { BreadCrumbService } from '../modules/common/breadCrumb';
import { ConfigService } from '../core/services/config.service';
import { Component } from '@angular/core';
import { QuotService } from '../modules/transaction/services/quote.service';


/**
 * This class represents the dashboard component.
 */


@Component({
    selector: 'b2c-dash-board',
    templateUrl: './b2c.dashboard.html'
})
export class B2CDashboard {
    insurance: any[];
    constructor(
        SharedService: SharedService,
        public configService: ConfigService,
        public quotService: QuotService,
        public breadCrumbService: BreadCrumbService,
        public b2CServices: B2CServices) {

        let insuranceResponse = this.configService.getJSON({ key: 'META', path: 'insurance' });
        insuranceResponse.subscribe((insurance) => {
            if (insurance !== null || insurance !== undefined) {
                this.insurance = insurance.insurance;
                this.configService.setLoadingSub('no');
            }
        });
    }

    gotToInsurance(insuranceCode) {
        this.b2CServices.setInsuranceType(insuranceCode);
       if (insuranceCode !== 'YTD') {
            this.configService.navigateRouterLink('b2c/products');
       }
    }
    getQuote(productCode) {
        window.scroll(0, 0);
        let queryParams = { productCode: productCode, eventType: 'NQ', transactionType: 'QT' };
        let routeUrl = this.quotService.getLOBRoute(productCode);
        if (routeUrl)
            this.configService.navigateRouterLink(routeUrl, queryParams);
    }
    gotoClaims() {
        this.configService.navigateRouterLink('ncp/claims');
    }
    gotoFAQ() {
        this.configService.navigateRouterLink('ncp/faq');
    }
}


