import { ThemeService } from './../../core/ui-components/theme/theme.services';
import { ConfigService } from '../../core/services/config.service';
import { Injectable, EventEmitter } from '@angular/core';
import { QuotService } from '../../modules/transaction/services/quote.service';
import { LocalStorageService } from '@adapters/packageAdapter';
import { environment } from '../../../environments/environment';

@Injectable()
export class B2CServices {
    insuranceType: string;
    product: string;
    credentials = [{
        "user_id": 'b2c',
        "user_lang_code": '',
        "user_name": '',
        "user_branch": '',
        "firstLogin": '',
        "user_password": '',
        "token": ''
    }];
    afterSessionEE = new EventEmitter();
    constructor(public configService: ConfigService, public quotService: QuotService, public localStorageService: LocalStorageService, public themeService: ThemeService) {
    };
    setInsuranceType(insuranceDesc) {
        this.insuranceType = insuranceDesc;
    }
    getInsuranceType() {
        return this.insuranceType;
    }
    setProduct(product) {
        this.product = product;
    }
    getProduct() {
        return this.product;
    }
    setSession() {
        let resp = this.configService.ncpRestAuthServiceCall('idmServices/createSecureSession', this.credentials, 'true');
        resp.subscribe((sessionData) => {
            if (sessionData) {
                this.configService.setCustom('user_id', 'b2c');
                this.configService.setCustom('token', sessionData['token']);
                this.configService.reGenerateToken();
                this.afterSessionEE.emit('b2cSessionCreated');
                if (environment.themeName) {
                    let b2cThemeName = this.themeService.getThemeName(environment.themeName, '', true);
                    if (b2cThemeName) {
                        this.configService.loadJsCssFile(b2cThemeName, 'css');
                    }
                }
                this.quotService.doFetchProductData();
            }
        });
    }
    getBranding() {
        let userLang = this.localStorageService.get('User_lang');
        if (userLang === 'en') {
            let brandJsonResponse = this.configService.getJSON( { key: 'META', path: 'branding' });
            brandJsonResponse.subscribe(
                (brandData) => {
                    if (brandData.error !== null
                        && brandData.error !== undefined
                        && brandData.error.length >= 1) {
                        // this._logger.error('ncpJsonCall()===>' + brandUrl.error);
                        return '';
                    } else {
                        this.configService.setCustom('branding', brandData);
                        this.configService.loggerSub.next('brandingLoaded');
                    }
                });
        } else {
            let brandJsonResponse = this.configService.getJSON( { key: 'META', path: 'branding_' + userLang });
            brandJsonResponse.subscribe(
                (brandData) => {
                    if (brandData.error !== null
                        && brandData.error !== undefined
                        && brandData.error.length >= 1) {
                        // this._logger.error('ncpJsonCall()===>' + brandUrl.error);
                        return '';
                    } else {
                        this.configService.setCustom('branding', brandData);
                        this.configService.loggerSub.next('brandingLoaded');
                    }
                });
        }
    }
}
