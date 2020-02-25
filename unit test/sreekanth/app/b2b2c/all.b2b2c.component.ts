import { environment } from '../../environments/environment';
import { B2B2CServices } from '../b2b2c/services/b2b2c.service';
import { ConfigService } from '../core/services/config.service';
import { AfterContentInit, Component } from '@angular/core';
import { HttpClient } from '@adapters/packageAdapter';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@adapters/packageAdapter';
import { ProductDetailsService } from '../modules/product/services/product.service';
import { map } from '@adapters/packageAdapter';
let localStorageServiceConfig = {
    prefix: 'NCP',
    storageType: 'localStorage'
};
@Component({

    selector: 'all-b2b2c-components',
    templateUrl: './all.b2b2c.component.html'
})

export class AllB2B2CComponents implements AfterContentInit {
    b2b2cFlag: boolean = false;
    routeUrl: string = ''
    partnerId: string = '';
    constructor(public configService: ConfigService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public http: HttpClient,
        public productDetailsService: ProductDetailsService,
        public localStorageService: LocalStorageService,
        public b2b2cServices: B2B2CServices) {
        // this.businessType = this.configService.getBusinessType();
        if (this.configService.getCustom('b2b2cFlag')) {
            this.localStorageService.get('User_lang') ? '' : this.localStorageService.set('User_lang', this.configService.get('b2b2cLang'));
            this.localStorageService.get('User_lang_Desc') ? '' : this.localStorageService.set('User_lang_Desc', this.configService.get('b2b2cLangDesc'));
            this.configService.loggerSub.next('langLoaded');
            this.partnerId = this.configService.getCustom('partnerId');
            if (this.partnerId && this.productDetailsService.getProductCode()) {
                this.b2b2cFlag = true;
                this.configService.navigateRouterLink(environment.b2b2cLandingUrl);
            } else if (!this.partnerId) {
                let configResponse = this.http.get('assets/config/env.json')
                    .pipe(map((res: Response) => res.json()));
                configResponse.subscribe((envData: any) => {
                    let env = envData;
                    let baseUrl = envData.baseUrl;
                    this.http.post(baseUrl + 'utils/getNCPConfig', { 'businessType': 'B2B' })
                        .pipe(map((res: Response) => res.json()))
                        .subscribe((data: any) => {
                            location.href = data.b2b2cRedirectURL;
                        });
                });
            }
        }
        this.configService.afterSessionEE.subscribe((data) => {
            if (data === 'sessionCreated') {
                this.b2b2cFlag = true;
            }
        });

    }
    ngAfterContentInit() {
        this.configService.loggerSub.subscribe((data) => {
            if (data === 'configLoaded' && this.configService.getCustom('b2b2cFlag')) {
                this.localStorageService.get('User_lang') ? '' : this.localStorageService.set('User_lang', this.configService.get('b2b2cLang'));
                this.localStorageService.get('User_lang_Desc') ? '' : this.localStorageService.set('User_lang_Desc', this.configService.get('b2b2cLangDesc'));
                this.configService.loggerSub.next('langLoaded');
            }
        });
    }
}



