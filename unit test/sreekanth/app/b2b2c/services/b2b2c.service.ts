import { ConfigService } from '../../core/services/config.service';
import { UtilsService } from '../../core/ui-components/utils/utils.service';
import { EventEmitter, Injectable } from '@angular/core';
import { LocalStorageService } from '@adapters/packageAdapter';
import { BehaviorSubject } from '@adapters/packageAdapter';

@Injectable()
export class B2B2CServices {
    productDetailsCode: string;
    lobCode: string;
    productDesc: string;
    routeJson: Object[] = [];
    chunkingSub = new EventEmitter();
    public menuAfterSession = new BehaviorSubject(false);
    credentials = [{
        "user_id": '',
        "user_lang_code": '',
        "user_name": '',
        "user_branch": '',
        "firstLogin": '',
        "user_password": '',
        'user_party_id': ''
    }];

    constructor(public configService: ConfigService, public localStorageService: LocalStorageService, public utilsService: UtilsService) {
        // let routeJsonResponse = this.utilsService.loadedSub.subscribe((routeUrl) => {
        //     this.routeJson = this.utilsService.getProductDetails();
        // });
    }
    setproductDetailsCode(productDetailsCode) {
        // this.productDesc = this.routeJson[productDetailsCode]['title'];
        this.productDesc = this.utilsService.getProductDetails(productDetailsCode)[0]['productName'];
        this.productDetailsCode = productDetailsCode;
    }
    getProductDetailsCode() {
        return this.productDetailsCode;
    }
    setLobCode(lobCode) {
        this.lobCode = lobCode;
    }
    getLobCode() {
        return this.lobCode;
    }
    getProductDesc() {
        return this.productDesc;
    }
    getChunkingData(partnerId, promoCode, partyId) {
        let lang;
        this.configService.setLoadingSub('yes');
        let url = this.configService.get('apiUrl');
        let inputJson = this.populateb2cb2b2cCredentials(partnerId, promoCode, partyId);
        let response = this.configService.ncpRestServiceCall('noncore/getWhiteLabellingDetails', inputJson);
        response.subscribe((data) => {
            if (data.error !== null && data.error !== undefined) {
                location.href = (this.configService.get('b2b2cRedirectURL'));
            } else if (data) {
                lang = this.localStorageService.get('User_lang');
                this.configService.setCustom('cobrandingData', data);
                let cobranding = data[lang];
                if (cobranding) {
                    this.configService.setCustom('cobranding', cobranding);
                    this.chunkingSub.emit(cobranding);

                    // For customized themeing for b2b2c users START
                    // let script = document.getElementsByTagName('script');
                    // let body = document.getElementsByTagName('script')[script.length - 1];
                    // let link = document.createElement('link');
                    // link.rel = 'stylesheet';
                    // link.type = 'text/css';
                    // link.href = cobranding['themeFile'];
                    // body.appendChild(link); 
                    //  For customized themeing END 
              
                    let appTitle = cobranding['ncpApp']['appName'];
                    let appIcon = cobranding['ncpApp']['appIcon'];
                    var appIconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    appIconLink['type'] = 'image/x-icon';
                    appIconLink['rel'] = 'shortcut icon';
                    appIconLink['href'] = appIcon;
                    document.getElementsByTagName('head')[0].appendChild(appIconLink);
                    this.configService.setLoadingSub('no');
                }
            }
        });

    }
    setSession() {
        this.credentials[0].user_id = this.configService.getCustom('partnerId');
        return this.configService.ncpB2B2CInitialService('idmServices/getUserDetails', this.credentials);
    }
    populateb2cb2b2cCredentials(partnerId: string, promocode: string, partyId: string) {
        let credentials = {
            'partnerID': partnerId,
            'promoCode': promocode,
            'partyId': partyId
        };
        return credentials;
    }

}
