import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../core/ui-components/modal/index';
import { ConfigService } from '../../core/services/config.service';
import { LocalStorageService } from '@adapters/packageAdapter';

@Component({
    templateUrl: './language.template.html',
    providers: [LocalStorageService]
})
export class LanguageComponent implements OnInit {
    brandinglangJson = [];
    configure: ConfigService;
    brandingImg: string = '';
    constructor(config: ConfigService, public localStorage: LocalStorageService) {
        this.configure = config;
        this.configure.loggerSub.subscribe(data => {
            if (data === 'configLoaded') this.brandingResponse()
        });
    }

    ngOnInit() {
        /* It will redirect to Login Page if User Language is Already Selected.*/
        let checkLang = this.localStorage.get('User_lang');
        if (checkLang) {
            this.configure.navigateRouterLink('/Login');
        }
    }

    changeLanguage(lang, languageDesc: any) {
        if (lang) {
            this.localStorage.set('User_lang', lang);
            this.localStorage.set('User_lang_Desc', languageDesc);
            this.configure.navigateRouterLink('/Login');
        }
    }
    brandingResponse() {
        let brandJsonResponse = this.configure.getJSON({ key: 'META', path: 'branding' });
        brandJsonResponse.subscribe(
            (brandUrl) => {
                if (brandUrl.error !== null
                    && brandUrl.error !== undefined
                    && brandUrl.error.length >= 1) {
                    // this._logger.error('ncpJsonCall()===>' + brandUrl.error);
                } else {
                    this.brandinglangJson = brandUrl['footerLogo'];
                    this.brandingImg = brandUrl['login']['src'];
                    this.configure.setCustom('branding', brandUrl);
                }
            });
    }
}

@NgModule({
    declarations: [LanguageComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalModule],
    exports: [LanguageComponent]
})
export class LanguageModule {
}
