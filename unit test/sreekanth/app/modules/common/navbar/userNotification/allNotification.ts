import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { QuotService } from '../../../transaction/services/quote.service';
import { BreadCrumbService } from '../../breadCrumb/index';
import { BannerService } from './../../banner/services/banner.service';
import { NotificationServices } from './services/userNotification.service';
import { Usernotification } from './userNotification';
import { AfterContentInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, interval } from '@adapters/packageAdapter';
import { TaskService } from '../../../../core/ui-components/ncp-calendar/utils/task.services';
@Component({
  templateUrl: './allNotification.html'
})
export class AllNotificationComponent implements AfterContentInit {
  configure: any;
  notifications: any[] = [];
  notificationDeletedLabel;
  notificationList: {};
  undoLabel;
  quoteEnquiryInfo;
  okLabel;
  usernotification;
  deleteFlag;
  notificationObs;
  quotOpenHeldFormGroup;
  noNotificationLabel: string = '';
  constructor(public config: ConfigService,
    public utils: UtilsService,
    public logger: Logger,
    public changeRef: ChangeDetectorRef,
    public notificationServices: NotificationServices,
    public quotService: QuotService,
    public quotEnquiryFB: FormBuilder,
    public taskService: TaskService,
    public bannerService: BannerService,
    public breadCrumbService: BreadCrumbService) {
    this.configure = config;
    let breadCrumbName = this.utils.getTranslated('NCPBreadCrumb.allNotifications');
    breadCrumbService.addRouteName('/ncp/allNotification', [{ 'name': breadCrumbName }]);
    this.usernotification = new Usernotification(config, utils, logger, changeRef, notificationServices, quotService, quotEnquiryFB,taskService, bannerService);

    this.notificationDeletedLabel = this.utils.getTranslated('NCPLabel.notificationDeleted');
    this.undoLabel = this.utils.getTranslated('NCPLabel.undo');
    this.okLabel = this.utils.getTranslated('NCPLabel.ok');
    this.noNotificationLabel = this.utils.getTranslated('NCPLabel.youDontHaveAnyNotificationsRightNow'); 
    this.notificationObs = interval(300000);
    this.notifications = this.notificationServices.getnotificationArray();
  }
  ngAfterContentInit() {
    this.notificationServices.notificationModalArray.subscribe((data) => {
      if (data) {
        this.notifications=data;
        this.config.setLoadingSub('no');
      } 
    });
     this.notificationObs.subscribe(() => {
        this.getNotifications();
        this.config.setLoadingSub('no');
     });
     this.changeRef.detectChanges();   
  }
  getNotifications() {
    let notificationResponse = this.notificationServices.getNotificationService();
    notificationResponse.subscribe(
      (notificationList) => {
        if (notificationList.error !== null
          && notificationList.error !== undefined
          && notificationList.error.length >= 1) {
          this.logger.error('getNotifications()===>' + notificationList.error);
        } else {
          this.notificationList = notificationList;
          this.notifications = this.notificationServices.getFormatedNotifications(this.notificationList);
          this.notificationServices.setnotificationArray(this.notifications);
        }
      });
  }
  deleteNotification(notification) {
    this.deleteFlag = notification.id;
  }

  clickUndo(notification) {
    this.deleteFlag = '';
  }

  confirmDelete(notification) {

    this.deleteFlag = '';
    this.notifications.splice(this.notifications.indexOf(notification), 1);
    this.notificationServices.setnotificationArray(this.notifications);
    let deletedObj = this.notificationServices.getUpdateDeleteObj(notification);
    this.notificationServices.deleteNotification(deletedObj);
    this.configure.setLoadingSub('no');
  }

  viewNotification(notification) {
    if (notification.enableView) {
      let naviagateUrl = this.notificationServices.getNotificationUrl(notification);
      notification.hasNotificationViewed = true;
      this.notifications[this.notifications.indexOf(notification)] = notification;
      let updatedObj = this.notificationServices.getUpdateDeleteObj(notification);
      this.configure.setLoadingSub('no');
      if (notification.notificationType === 'REF') {
        let quoteObj = {

          'productCd': notification.productCd,
          'quoteNo': notification.quoteNo,
          'status': notification.status,
          'quoteVerNo': notification.quoteVerNo
        };
        this.quotOpenHeldFormGroup = this.quoteEnquiryInfo.getQuotOpenHeldInfoModel();
        this.quotOpenHeldFormGroup.controls['policyInfo'].patchValue(quoteObj);
        this.quotOpenHeldFormGroup.controls['policyInfo'].updateValueAndValidity();
        let quotOpenHeldResponse = this.quotService.getQuotOpenheldInfo(this.quotOpenHeldFormGroup.value);
        quotOpenHeldResponse.subscribe(
          (quotEnquiryInfodataVal) => {
            if (quotEnquiryInfodataVal.error !== null
              && quotEnquiryInfodataVal.error !== undefined
              && quotEnquiryInfodataVal.error.length >= 1) {
              this.logger.error('getQuotInfo()===>' + quotEnquiryInfodataVal.error);
            } else {
              this.confirmDelete(notification);
              this.configure.setCustom('openHeld', quotEnquiryInfodataVal);
              this.configure.navigateRouterLink(naviagateUrl);
              this.changeRef.markForCheck();
            }
            this.configure.setLoadingSub('no');
          },
          (error) => {
            this.logger.error(error);
            this.configure.setLoadingSub('no');
          });

      } else if (notification.notificationType === 'POL') {
        this.notificationServices.updateNotification(updatedObj);
        this.configure.resetfilterModel();
        let filterObj = this.configure.getfilterModel();
        filterObj.policyExpiringInDays = '7';
        filterObj.maxRecords = notification.noOfPolicies.toString();
        filterObj.status = [{ code: "PT", desc: "Policy Posted", key: "PT" }];
        filterObj.isNotificationFlag = true;
        filterObj.isPolicyOrQuote = 'PO';
        this.configure.setfilterModel(filterObj);
        this.notificationServices.setnotificationArray(this.notifications);
        this.configure.navigateRouterLink(naviagateUrl);

      } else if (notification.notificationType === 'QT') {
        this.notificationServices.updateNotification(updatedObj);
        this.configure.resetfilterModel();
        let filterObj = this.configure.getfilterModel();
        filterObj.quoteExpiringInDays = '7';
        filterObj.isNotificationFlag = true;
        filterObj.status = [{ code: "QT", desc: "Quote Pending", key: "QT" }];
        filterObj.isPolicyOrQuote = 'QT';
        filterObj.maxRecords = notification.noOfQuotes.toString();
        this.configure.setfilterModel(filterObj);
        this.notificationServices.setnotificationArray(this.notifications);
        this.configure.navigateRouterLink(naviagateUrl);
      } else {
        this.notificationServices.updateNotification(updatedObj);
        this.configure.navigateRouterLink(naviagateUrl);
        this.notificationServices.setnotificationArray(this.notifications);
      }
    }
  }
}