import { SharedService } from '../../../core/shared/shared.service';
import { ConfigService } from '../../../core/services/config.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { BreadcrumbModule } from './../breadCrumb/breadCrumb.component';
import { NotificationServices } from './../navbar/userNotification/services/userNotification.service';
import { BannerService } from './services/banner.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@adapters/packageAdapter';
import { UiMiscModule } from '../../../core/ui-components/misc-element/misc.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateService } from '@adapters/packageAdapter';



@Component({
    selector: 'banner',
    templateUrl: './banner.template.html'

})
export class BannerComponent implements OnInit, OnDestroy {
    showHeader1: boolean = false;
    headerText;
    headerText1;
    notificationArray: number = 0;
    notificationArrayCount: any;
    imgURL: string;
    _imgURL: string;
    description;
    descriptionTitle;
    descriptionSecondTitle;
    descriptionDetails;
    mobileDescription;
    showNotificationYes: boolean = true;
    showNotificationNo: boolean = false;
    showCustomerFlag: boolean = false;
    showHeaderFlag: boolean = false;
    hideNotification: boolean;
    showBanner: boolean;
    showSecondTitle: boolean = false;
    banner = "banner";
    routerSubscription;
    showAllBanner: any = true;
    showBreadcrumb: boolean = true;
    b2b2cFlag: boolean = false;
    configLoggerSub: any;
    constructor(

        public bannerService: BannerService,
        public router: Router,
        public notificationServices: NotificationServices,
        public configService: ConfigService,
        public http: HttpClient,
        public activatedRoute: ActivatedRoute,
        public shared: SharedService,
        public translate: TranslateService
    ) {
        this.bannerService.bannerHeader.subscribe((data) => {
            this.headerText = this.bannerService.headerText;
            if (this.headerText == 'NCPLabel.Home') {
                let userCode = this.configService.getCustom('user_prf_group_code');
                let b2cFlag = this.configService.getCustom('b2cFlag')
                this.hideNotification = false;
                this.headerText1 = "NCPLabel.welcome";
                let userName = this.configService.getCustom('user_name');
                this.headerText = userName;
                let notificationCount = this.notificationServices.getnotificationArray();
                if (this.notificationArray != 0) {
                    this.showNotificationYes = true;
                    this.showNotificationNo = false;
                    let userName = this.configService.getCustom('user_name');
                    this.headerText = userName;
                    if (userCode == 'ADMN' || b2cFlag == true) {
                        this.hideNotification = true;
                    }
                }
                this.notificationServices.countEventEmitter.subscribe((data) => {
                    let count;
                    count = data;
                    this.notificationArray = count;
                    if (this.notificationArray != 0) {
                        this.showNotificationYes = true;
                        this.showNotificationNo = false;
                        let userName = this.configService.getCustom('user_name');
                        this.headerText = userName;
                        if (userCode == 'ADMN' || b2cFlag == true) {
                            this.hideNotification = true;
                        }
                    }
                    else {
                        this.showNotificationYes = false;
                        this.showNotificationNo = true;
                    }
                })
            }
            else {
                this.headerText1 = "";
                this.hideNotification = true;
            }
        });

        this.bannerService.showBannerSubject.subscribe((data) => {
            this.showAllBanner = data;
        });

        // this.bannerService.bannerText.subscribe((data) => {
        //     console.log(data)
        //     this.headerText1 = this.bannerService.headerText1;
        // });

        this.bannerService.bannerDescription.subscribe((data) => {
            this.description = this.bannerService.description;
            this.descriptionTitle = this.description.title;
            if (this.description.title1) {
                this.showSecondTitle = true;
                this.descriptionSecondTitle = this.description.title1;
            }
            else {
                this.showSecondTitle = false;
            }
            this.descriptionDetails = this.description.description;
            this.mobileDescription = this.description.mobileDescription;
        });
        this.bannerService.bannerHideNotificationFlag.subscribe((data) => {
            this.hideNotification = this.bannerService.hideNotificationFlag;

        });
        this.bannerService.bannerImgURL.subscribe((data) => {
            if (this.bannerService.bannerImage) {
                this.imgURL = this.bannerService.bannerImage;
                this._imgURL = this.bannerService._bannerImage;
            }
            else {
                this.imgURL = "";
                this._imgURL = '';
            }
            //  this.showHeader1 = false;
        });
        this.b2b2cFlag = this.configService.getCustom('b2b2cFlag');
    }

    ngOnInit() {
        this.configLoggerSub = this.configService.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.configService.currentLangName);
            }
        });
    }

    navigateToNotification() {
        this.configService.navigateRouterLink('/ncp/allNotification');

    }
    ngOnDestroy() {
        if (this.configLoggerSub) {
            this.configLoggerSub.unsubscribe();
        }
    }
}
@NgModule({
    declarations: [BannerComponent],
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbModule, SharedModule, UiMiscModule],
    exports: [BannerComponent]
})
export class BannerModule { }
