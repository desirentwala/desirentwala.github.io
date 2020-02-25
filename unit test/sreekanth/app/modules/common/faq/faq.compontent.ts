import { Component, NgModule,AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger';
import { BreadCrumbService } from '../breadCrumb/services/breadcrumb.service';
import { TranslateService } from '@adapters/packageAdapter';
@Component({
    templateUrl: './faq.template.html',
})
export class FaqComponent implements AfterContentInit {
    public oneAtATime: boolean = true;
    public config: ConfigService;
    public status: Object = {
        isFirstOpen: true,
        isFirstDisabled: true
    };
    public groups: Array<any>;
    constructor(_config: ConfigService, public translate: TranslateService,public _logger: Logger, public breadCrumbService: BreadCrumbService) {
        window.scrollTo(0, 0);
        this.config = _config;
        let faqJsonResponse = this.config.getJSON( { key: 'META', path: 'faq' });
        faqJsonResponse.subscribe(
            (faqUrl) => {
                if (faqUrl) {
                    this.groups = faqUrl;
                }
            });
        breadCrumbService.addRouteName('/ncp/faq', [{ 'name': 'Frequently Asked Questions' }]);
    }
    ngAfterContentInit() {
        this.config.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.config.currentLangName);
            }
        });
        this.config.setLoadingSub('no'); 
    }
    escapeSpecialChars(json) {
        let myJSONString = JSON.stringify(json);
        let myEscapedJSONString = myJSONString.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
        return myEscapedJSONString;
    }
}
