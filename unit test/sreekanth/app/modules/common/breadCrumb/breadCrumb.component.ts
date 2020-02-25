import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@adapters/packageAdapter';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

import { ConfigService } from '../../../core/services/config.service';
import { SharedModule } from './../../../core/shared/shared.module';
import { BannerService } from './../banner/services/banner.service';
import { BreadCrumbService } from './services/breadcrumb.service';
import { TranslateService } from '@adapters/packageAdapter';
import { SharedService } from '../../../core/shared/shared.service';
import { delay } from '@adapters/packageAdapter';
/**
 * This component shows a breadcrumb trails for available routes the router can navigate to.
 *
 */
@Component({
    selector: 'bread-crumb',
    templateUrl: './breadCrumb.html'

})
export class BreadcrumbComponent implements OnInit {
    public trailurl: any[];
    public _routerSubscription: any;
    breadcrumbs: any[] = [];
    disableIcons: boolean = false;
    public hideHeaderTextList: string[] = ['Travel Claim', 'FNOL', 'Claims', 'FNOLNotifyClaim'];

    constructor(
        public router: Router,
        public breadcrumbService: BreadCrumbService,
        public configService: ConfigService,
        public http: HttpClient,
        public activatedRoute: ActivatedRoute,
        public bannerService: BannerService,
        public translate: TranslateService,
        public shared: SharedService
    ) {
        this.trailurl = new Array();
        this._routerSubscription = this.router.events.pipe(delay(20)).subscribe((navigationEnd: NavigationEnd) => this.loadData(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url));
        this.loadData(this.router.url);
    }

    ngOnInit(): void {

        this.configService.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.configService.currentLangName);
            }
        });

        this.configService.routeNameAddSub.subscribe((data) => {
            if (data === 'addManually') {
                this.loadData(this.router.url);
            }
        });

        this.disableIcons = this.configService.get('hideIcons');
    }

    generateBreadcrumbTrail(url: string): void {
        this.trailurl = this.breadcrumbService.getRouteName(url);
    }

    navigate(url) {
        this.breadcrumbService.navigate(url);
    }

    public loadData(url: string) {
        this.bannerService.loadBannerImage(url);
        this.generateBreadcrumbTrail(url);
        let localNameArray = this.trailurl;
        if (localNameArray && localNameArray.length > 0) {
            let localNameArrayReversed = [];
            localNameArrayReversed = localNameArray.reverse();
            let headerText = this.hideHeaderTextList.indexOf(localNameArrayReversed[0].name) < 0 ? localNameArrayReversed[0].name : '';
            this.bannerService.setHeader(headerText);
            this.trailurl.reverse();
        }
    }

}
@NgModule({
    declarations: [BreadcrumbComponent],
    imports: [CommonModule, FormsModule, RouterModule, SharedModule],
    exports: [BreadcrumbComponent, SharedModule]
})
export class BreadcrumbModule { }
