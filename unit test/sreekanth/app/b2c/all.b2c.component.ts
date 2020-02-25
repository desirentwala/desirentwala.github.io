import { environment } from '../../environments/environment';
import { UserService } from '../auth/login';
import { ConfigService } from '../core/services/config.service';
import { ProductDetailsService } from '../modules/product/services/product.service';
import { B2CServices } from './service/b2c.service';
import { AfterContentInit, Component } from '@angular/core';

import { LocalStorageService } from '@adapters/packageAdapter';

let localStorageServiceConfig = {
    prefix: 'NCP',
    storageType: 'localStorage'
};
@Component({

    selector: 'all-b2c-components',
    templateUrl: 'all.b2c.component.html',
})
export class AllB2CComponents implements AfterContentInit {
    sessionFlag: boolean = false;
    constructor(public configService: ConfigService, public userService: UserService, public b2cServices: B2CServices, public productDetailsService: ProductDetailsService, public localStorageService: LocalStorageService) {
        this.configService.setCustom('b2cFlag', true);
        if (this.productDetailsService.getProductCode()) {
            this.configService.navigateRouterLink(environment.b2cLandingUrl);
            this.sessionFlag = true;
        }
        this.b2cServices.afterSessionEE.subscribe((data) => {
            if (data === 'b2cSessionCreated') {
                this.productDetailsService.setproductCode(this.configService.get('b2cProduct'));
                this.b2cServices.getBranding();
                this.configService.navigateRouterLink(environment.b2cLandingUrl);
                this.sessionFlag = true;
            }
        });
        this.configService.loggerSub.subscribe((data) => {
            if (data === 'configLoaded') {
                this.configService.setLoadingSub('yes');
                this.localStorageService.get('User_lang') ? '' : this.localStorageService.set('User_lang', this.configService.get('b2b2cLang'));
                this.localStorageService.get('User_lang_Desc') ? '' : this.localStorageService.set('User_lang_Desc', this.configService.get('b2b2cLangDesc'));
                this.configService.loggerSub.next('langLoaded');
                this.b2cServices.setSession();
                this.userService.setLoggedIn();
            }
        });
    }
    ngAfterContentInit() {


    }
}



