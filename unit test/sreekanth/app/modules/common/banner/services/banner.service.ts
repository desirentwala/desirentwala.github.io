import { Subject } from '@adapters/packageAdapter';
import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger';
import { Injectable } from '@angular/core';

@Injectable()
export class BannerService {
    public headerText: string;
    public headerText1: string;
    public description: string;
    public bannerImage;
    public _bannerImage;
    public bannerData;
    public bannerHeader = new Subject();
    public bannerText = new Subject();
    public bannerDescription = new Subject();
    public bannerHideNotificationFlag = new Subject();
    public bannerImgURL = new Subject();
    public showBannerSubject = new Subject();
    public showPage: boolean;
    public showCustomerName: boolean = false;
    public showHeaderText: boolean = false;
    public hideNotificationFlag: boolean = false;
    public showBannerFlag: boolean
    constructor(public logg: Logger, public config: ConfigService) {
        this.getBannerData();
    }

    getBannerData(url?) {
        let bannerImage = this.config.getJSON( { key: 'META', path: 'banner' });
        bannerImage.subscribe((bannerData) => {
            this.bannerData = bannerData;
            if (url) {
                this.loadBannerImage(url);
            }
        });
    }

    loadBannerImage(url: any) {
        if (this.bannerData) {
            if (this.bannerData[url]) {
                this.showBanner(true);
            } else {
                this.showBanner(false);
            }
            for (let bannerUrl in this.bannerData) {
                if (bannerUrl === url) {
                    this.setBannerImage(this.bannerData[bannerUrl]['imgUrl'],this.bannerData[bannerUrl]['mobileimgUrl']);
                    this.setDescription(this.bannerData[bannerUrl]['Desc']);
                    break;
                }
            }
        } else {
            this.getBannerData(url);
        }
    }

    setBannerDetails(description: string, showNotification: boolean) {

        // this.setHeader(header);

        // this.setDescription(description);
        // this.setBannerImage(bannerImageURL);
        // this.showBanner(showBanner);
        this.setHideNotification(showNotification);

    }
    setHeader(headerText) {
        this.headerText = headerText;
        this.bannerHeader.next(this.headerText);

    }
    setText(text) {
        this.headerText1 = text;
        this.bannerText.next(this.headerText1);


    }
    showBanner(flag: boolean) {
        this.showBannerFlag = flag;
        this.showBannerSubject.next(this.showBannerFlag);
    }
    setDescription(text) {
        this.description = text;
        this.bannerDescription.next(this.description);
    }

    setHideNotification(flag: boolean) {
        this.hideNotificationFlag = flag;
        this.bannerHideNotificationFlag.next(this.hideNotificationFlag);
    }

    setBannerImage(imgURL: string, _imgURL: string) {
        this.bannerImage = imgURL;
        this._bannerImage = _imgURL;
        this.bannerImgURL.next(this.bannerImage);
        this._bannerImage = _imgURL;


    }





    // showCurrentPage(showCurrentPage: boolean) {
    //     this.showPage = showCurrentPage;
    //     this.bannerSubject.next();


    // }
}
