import { AfterContentInit,Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger';
import { BreadCrumbService } from '../breadCrumb/services/breadcrumb.service';
import { LocalStorageService } from '@adapters/packageAdapter';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@adapters/packageAdapter';
@Component({
    templateUrl: './termsAndConditions.html',
})

export class termsAndConditionsComponent implements AfterContentInit {
    public oneAtATime: boolean = true;
    public config: ConfigService;
    public status: Object = {
        isFirstOpen: true,
        isFirstDisabled: true
    };
    public groups: Array<any>;
    termsJson = [];
    accordJson = [];
    constructor(_config: ConfigService,public translate: TranslateService, public _logger: Logger, public breadCrumbService: BreadCrumbService, public localStorage: LocalStorageService) {
        window.scrollTo(0, 0);
        this.config = _config;
        _config.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.getTermsAndConditions();
            }
        });
        this.getTermsAndConditions();
    }
    ngAfterContentInit() {
        this.config.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.config.currentLangName);
            }
        });
    }

    getTermsAndConditions() {
        let userLang = this.localStorage.get('User_lang');
        let build = this.config.get('build');
        let env = environment.project;
        let src;
        if (build) {
            src = env + build + 'TermsAndConditions' + userLang;
        }
        else {
            src = 'termsAndConditions';
        }
        let termsJsonResponse = this.config.getJSON( { key: 'META', path: src });
        termsJsonResponse.subscribe(
            (termsUrl) => {
                if (termsUrl) {
                    this.groups = termsUrl;
                    this.termsJson = termsUrl.terms;
                    this.accordJson = termsUrl.accordian;
                }
            });
        this.config.setLoadingSub('no');
    }

}
