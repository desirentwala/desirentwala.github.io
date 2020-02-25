import { SharedService } from '../../../../core/shared/shared.service';
import { UserService } from '../../../../auth/login';
import { ConfigService } from '../../../../core/services/config.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { ModalModule } from '../../../../core/ui-components/modal/index';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { DefaultPolicyModel } from '../../../common/services/defaultModel.service';
import { QuotService } from '../../../transaction/services/quote.service';
import { BannerService } from './../../banner/services/banner.service';
import { NotificationServices } from './services/userNotification.service';
import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, NgModule, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, interval } from '@adapters/packageAdapter';
import { UiButtonModule } from '../../../../core/ui-components/button/index';
import { UiMiscModule } from '../../../../core/ui-components/misc-element/misc.component'
import { environment } from '../../../../../environments/environment';
import { TaskService } from '../../../../core/ui-components/ncp-calendar/utils/task.services';

/**
 * This class represents the Notification Component
 */
@Component({
  selector: 'ncp-usernotification',
  templateUrl: './userNotification.html'
})
export class Usernotification implements AfterContentInit {
  rotateFlag: boolean = false;
  personlaDetailLink;
  userSettingsLink;
  helpLink;
  latestNotificationArray = [];
  oldNotificationArray = [];
  notificationList: {};
  newNotificationCount;
  deleteFlag = '';
  configure: ConfigService;
  viewHideNotificationBtn;
  showAllFlag: boolean = false;
  public loginUserName: any;
  formatedDate;
  userLang;
  notificationArray = [];
  notificationObj: any;
  modalCloseEvent: any;
  quoteOpenHeldForm: FormBuilder;
  quoteEnquiryInfo;
  quotOpenHeldFormGroup;
  notificationObs;
  userBoxFlag: boolean = false;
  showBellFlag: boolean = true;
  mobileviewFlag: boolean = false;
  userGroup: string = '';
  notificationModal: boolean = false;
  enableScreenConfigurator: boolean = false;
  dateParts = [];
  latestTaskNotificationArray = [];
  latestEventNotificationArray = [];
  constructor(config: ConfigService,
    public utils: UtilsService,
    public logger: Logger,
    public changeRef: ChangeDetectorRef,
    public notificationServices: NotificationServices,
    public quotService: QuotService,
    public quotEnquiryFB: FormBuilder,
    public taskService: TaskService,
    public bannerService: BannerService,
    public userService?: UserService,
    shared?: SharedService
  ) {
    let quoteModelInstance = new DefaultPolicyModel(quotEnquiryFB);
    this.quoteEnquiryInfo = quoteModelInstance.getQuoteEnquiryInfo();
    this.configure = config;
    this.userSettingsLink = { 'url': '/ncp/idm' };
    this.helpLink = { 'url': '/ncp/idm' };
    this.loginUserName = this.configure.getCustom('user_name');
    this.userGroup = this.configure.getCustom('user_prf_group_code');
    if (this.userGroup === 'ADMN') {
      this.showBellFlag = false;
    } else if (!this.userGroup) {
      this.showBellFlag = false;
    }
    if (this.showBellFlag) {
      this.getNotifications();
    }
    // observable to retreive Notification Service every 5 minutes
    this.notificationObs = interval(300000);
    this.enableScreenConfigurator = environment.enableScreenConfigurator;

  }
  ngAfterContentInit() {
    if (this.showBellFlag) {
      this.notificationObs.subscribe(() => {
        this.getNotifications();
        this.newNotificationCount = this.notificationServices.getNotificationCount();
        this.latestNotificationArray = this.notificationArray.slice(0, 5);
      });
      this.notificationServices.countEventEmitter.subscribe((count) => {
        this.newNotificationCount = count;
        this.notificationArray = this.notificationServices.getnotificationArray();
        this.latestNotificationArray = this.notificationArray.slice(0, 5);
      });
      this.changeRef.detectChanges();
    }
    let input = { 'taskID': '' };
    let date = new Date();
    let retriveTaskResponse = this.taskService.retrieveTask(input);
    retriveTaskResponse.subscribe(
      (taskData) => {
        if (taskData) {
          if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
            this.configure.setLoadingSub('no');
          } else {
            this.configure.setLoadingSub('no');
            for (let i = 0; i < taskData.length; i++) {
              this.dateParts = [];
              if (taskData[i].endDate !== undefined) {
                this.dateParts = taskData[i].endDate.split("/");
                if (parseInt(this.dateParts[2]) === date.getFullYear()) {
                  if (parseInt(this.dateParts[1]) === date.getMonth() + 1) {
                    if (parseInt(this.dateParts[0]) === date.getDate()) {
                      this.latestTaskNotificationArray.push(taskData[i]);
                    }
                  }
                }
              }
            }
            this.newNotificationCount = this.newNotificationCount;
            if(this.latestTaskNotificationArray.length > 0){
              this.newNotificationCount = this.newNotificationCount + this.latestTaskNotificationArray.length;
            }
          }
        } else {
          this.configure.setLoadingSub('no');
        }
      });

    let retriveEventResponse = this.taskService.getTaskList(input);
    retriveEventResponse.subscribe(
      (taskData) => {
        if (taskData) {
          if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
            this.configure.setLoadingSub('no');
          } else {
            this.configure.setLoadingSub('no');
            for (let i = 0; i < taskData.length; i++) {
              this.dateParts = [];
              if (taskData[i].startDate !== undefined) {
                this.dateParts = taskData[i].startDate.split("/");
                if (parseInt(this.dateParts[2]) === date.getFullYear()) {
                  if (parseInt(this.dateParts[1]) === date.getMonth() + 1) {
                    if (parseInt(this.dateParts[0]) === date.getDate()) {
                      this.latestEventNotificationArray.push(taskData[i]);
                    }
                  }
                }
              }
            }
            this.newNotificationCount = this.newNotificationCount;
            if(this.latestTaskNotificationArray.length > 0){
              this.newNotificationCount = this.newNotificationCount + this.latestEventNotificationArray.length;
            }
          }
        } else {
          this.configure.setLoadingSub('no');
        }
      });
  }

  getNotifications() {
    let date = new Date('2017/03/02 10:38:24 +0530');

    let notificationResponse = this.notificationServices.getNotificationService();
    notificationResponse.subscribe(
      (notificationList) => {
        if (notificationList.error !== null
          && notificationList.error !== undefined
          && notificationList.error.length >= 1) {
          this.logger.error('getNotifications()===>' + notificationList.error);
        } else {
          this.notificationList = notificationList;
          this.notificationArray = this.notificationServices.getFormatedNotifications(this.notificationList);
          this.notificationServices.setnotificationArray(this.notificationArray);
          this.newNotificationCount = this.notificationServices.getNotificationCount();
          this.notificationServices.countEventEmitter.emit(this.newNotificationCount);
        }
      });
  }

  opennotificationModal() {
    this.notificationServices.notificationModalOpen.emit('open');
    let modalOverLayss = document.getElementsByClassName("modal-backdrop");
    for (let i = 0; i < modalOverLayss.length; i++) {
      if ((<HTMLElement>modalOverLayss[i])) {
        (<HTMLElement>modalOverLayss[i]).style.display = "none"
      }
    }
    this.mobileviewFlag = true;
    this.latestNotificationArray = this.notificationArray.slice(0, 5);
  }

  viewNotification(notification) {
    if (notification.enableView) {
      this.closeNotification();
      let naviagateUrl = this.notificationServices.getNotificationUrl(notification);
      notification.hasNotificationViewed = true;
      this.notificationArray[this.notificationArray.indexOf(notification)] = notification;
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
        this.notificationServices.setnotificationArray(this.notificationArray);
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
        this.notificationServices.setnotificationArray(this.notificationArray);
        this.configure.navigateRouterLink(naviagateUrl);
      } else if (notification.notificationType === 'TSK') {
        this.notificationServices.updateNotification(updatedObj)
        let taskNotificationFlag = true;
        this.configure.taskNotificationFlag.emit(taskNotificationFlag);
      }
    }
  }

  showAllNotification() {
    this.closeNotification();
    this.notificationServices.setnotificationArray(this.notificationArray);
    this.configure.navigateRouterLink('ncp/allNotification');
  }

  deleteNotification(notification) {
    this.deleteFlag = notification.id;
  }

  clickUndo(notification) {
    this.deleteFlag = '';
  }

  confirmDelete(notification) {
    this.deleteFlag = '';
    this.notificationArray.splice(this.notificationArray.indexOf(notification), 1);
    this.latestNotificationArray = this.notificationArray.slice(0, 5);
    this.notificationServices.setnotificationArray(this.notificationArray);
    let deletedObj = this.notificationServices.getUpdateDeleteObj(notification);
    this.notificationServices.deleteNotification(deletedObj);
    this.configure.setLoadingSub('no');

  }

  openUserProfile() {
    this.configure.navigateRouterLink('/ncp/userprofile');
  }
  openFAQ() {
    this.configure.navigateRouterLink('/ncp/faq');
  }
  logout() {
    this.userService.logoutUser();
  }
  openScreenConfigurator() {
    this.configure.navigateRouterLink('/se/starter');
  }
  ngOnDestroy() {
    //this.notificationObs.unsubscribe();
  }
  closeNotification() {
    this.notificationServices.setnotificationArray(this.notificationArray);
    this.notificationServices.notificationModalOpen.emit('close');
    this.mobileviewFlag = false;
  }
}

@NgModule({
  imports: [ModalModule, CommonModule, SharedModule, UiButtonModule, UiMiscModule],
  declarations: [Usernotification],
  exports: [Usernotification],
  providers: [UtilsService]
})
export class UsernotificationModule { }
