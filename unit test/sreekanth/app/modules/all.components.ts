import { AfterContentInit, Component } from '@angular/core';
import { HttpClient } from '@adapters/packageAdapter';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@adapters/packageAdapter';
import { TranslateService } from '@adapters/packageAdapter';
import { B2B2CServices } from '../b2b2c/services/b2b2c.service';
import { ConfigService } from '../core/services/config.service';
import { ProductDetailsService } from './product/services/product.service';

let localStorageServiceConfig = {
    prefix: 'NCP',
    storageType: 'localStorage'
};
@Component({

    selector: 'all-components',
    templateUrl: './allcomponents.html'
})

export class AllComponents implements AfterContentInit {
    b2cFlag: boolean = false;
    b2b2cFlag: boolean = false;
    b2bFlag: boolean = false;
    routeUrl: string = ''
    partnerId: string = '';
    path;
    url;
    dataLoadedFlag: boolean = false;
    firstLogin: boolean = false;
    initiatePosting: boolean = false;
    constructor(public configService: ConfigService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public http: HttpClient,
        public productDetailsService: ProductDetailsService,
        public localStorageService: LocalStorageService,
        public b2b2cServices: B2B2CServices,
        public translate: TranslateService) {

        if (this.configService.getCustom('b2cFlag')) {
            this.b2cFlag = true;
            this.b2b2cFlag = false;
            this.b2bFlag = false;
        } else if (this.configService.getCustom('b2b2cFlag')) {
            this.b2cFlag = false;
            this.b2b2cFlag = true;
            this.b2bFlag = false;

        } else if (this.configService.getCustom('firstLoginFlag')) {
            this.b2cFlag = false;
            this.b2b2cFlag = false;
            this.b2bFlag = false;
            this.firstLogin = false;
        } else if (this.configService.getCustom('initiatePosting')) {
            this.b2cFlag = false;
            this.b2b2cFlag = false;
            this.b2bFlag = false;
            this.firstLogin = false;
            this.initiatePosting = true;
        } else {
            this.configService.addGoogleAnalyticsScript();
            this.b2cFlag = false;
            this.b2b2cFlag = false;
            this.b2bFlag = true;
            this.initiatePosting = false;
        }
        this.configService.afterSessionEE.subscribe((data) => {
            if (data === 'firstLogin') {
                this.b2cFlag = false;
                this.b2b2cFlag = false;
                this.b2bFlag = false;
                this.firstLogin = true;
            } else if (data === 'externalLogin') {
                this.b2cFlag = false;
                this.b2b2cFlag = false;
                this.b2bFlag = true;
                this.firstLogin = false;
                let isExternalLogin = this.configService.getCustom('isExternalLogin');
            } else if (data === 'initiatePosting') {
                this.b2cFlag = false;
                this.b2b2cFlag = false;
                this.b2bFlag = false;
                this.initiatePosting = true;
                this.firstLogin = false;
                // this.initiatePosting = true;
            } else if (data === 'postingDone') {
                this.b2cFlag = this.configService.getCustom('b2cFlag');
                this.b2b2cFlag = this.configService.getCustom('b2b2cFlag');
                this.b2bFlag = this.configService.getCustom('b2bFlag');
                this.firstLogin = false;
                this.initiatePosting = false;
            }

        });
    }
    ngAfterContentInit() {

    }
}



