import { ConfigService } from '../../../../../core/services/config.service';
import { Logger } from '../../../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../../../core/ui-components/utils/utils.service';
import { EventEmitter, Injectable } from '@angular/core';
import { NotificationConfigConst } from '../config/notification.configuration';
/**
 * This class provides the NotificationServices service with methods to Get Formated Notifications, services to get Notification List, delte notification and update notification. 
 */
@Injectable()
export class NotificationServices {
  userLang;
  public newNotificationCount = '0';
  public notificationArray = [];
  public notificationList: any;
  i = 0;
  routeJson = {};
  countEventEmitter = new EventEmitter<string>();
  notificationModalOpen = new EventEmitter<string>();
  notificationModalArray: EventEmitter<any>=new EventEmitter();
  constructor(public logger: Logger, public configService: ConfigService, public utilsService: UtilsService) {}
  setnotificationArray(notifications) {
    this.notificationArray = [];
    if (notifications.length > 0) {
      this.notificationArray = notifications;
    }
     this.notificationModalArray.emit(this.notificationArray);
  }
  getnotificationArray() {
    return this.notificationArray;

  }
  getNotificationService() {
    let notificationResponse;
    notificationResponse = this.configService.ncpRestServiceWithoutLoadingSubCall('notification/retrieveNotifications', {});
    return notificationResponse;
  }

  deleteNotification(notification) {
        this.configService.ncpRestServiceCallWithoutJsonResponse('notification/deleteNotification', notification).subscribe();
    this.countEventEmitter.emit(this.getNotificationCount());
  }

  updateNotification(notification) {
    this.configService.ncpRestServiceCallWithoutJsonResponse('notification/updateNotification', notification).subscribe();
    this.countEventEmitter.emit(this.getNotificationCount());
  }
  getFormatedNotifications(notificationList) {
    this.i = 0;
    this.notificationArray = [];
    this.notificationList = notificationList.notifications;
    let notifications = notificationList.notifications;
    if (notifications) {
      if (notifications.policy){
        notifications.policy['showDeletebtn'] = NotificationConfigConst.PolicyConfig.showDeletebtn;
        notifications.policy['enableView'] = NotificationConfigConst.PolicyConfig.enableView;
        this.notificationArray.push(notifications.policy);
      }
      if (notifications.quote){
        notifications.quote['showDeletebtn'] = NotificationConfigConst.QuoteConfig.showDeletebtn;
        notifications.quote['enableView'] = NotificationConfigConst.QuoteConfig.enableView;
        this.notificationArray.push(notifications.quote);
      }
    if (notifications.task) {
        notifications.task.forEach(task => {
          task['showDeletebtn'] = NotificationConfigConst.TaskConfig.showDeletebtn;
          task['enableView'] = NotificationConfigConst.TaskConfig.enableView;
          this.notificationArray.unshift(task);
        });
      }
      if (notifications.referral) {
        notifications.referral.forEach(referral => {
          referral['showDeletebtn'] = NotificationConfigConst.ReferralConfig.showDeletebtn;
          referral['enableView'] = NotificationConfigConst.ReferralConfig.enableView;
          this.notificationArray.unshift(referral);
        });
      }
      if(notifications.payment){
        notifications.payment.forEach(payment => {
          payment['showDeletebtn'] = NotificationConfigConst.PaymentConfig.showDeletebtn;
          payment['enableView'] = NotificationConfigConst.PaymentConfig.enableView;
          this.notificationArray.unshift(payment);
        });
      }
    }
    this.notificationArray.forEach(notification => {
      notification.id = this.i;
      this.i++;
      if (notification.notificationType === 'POL' || notification.notificationType === 'QT' || notification.notificationType === 'TSK' || notification.notificationType === 'PAY') {
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        notification.updatedDate = date;
      }
    });
    this.userLang = this.configService.getCustom('user_lang');
    this.notificationArray.forEach(notification => {

      if (notification.referralStatus === 'B001') {
        notification.title = this.utilsService.getTranslated('NCPNotificationTitle.referralQuote') ?
          this.utilsService.getTranslated('NCPNotificationTitle.referralQuote') + ' '
          + notification.quoteNo + ' '
          + this.utilsService.getTranslated('NCPNotificationTitle.approved') : 'Referral Quote ' + notification.quoteNo + ' Approved';

      } else if (notification.referralStatus === 'B003') {
        notification.title = this.utilsService.getTranslated('NCPNotificationTitle.referralQuote') ?
          this.utilsService.getTranslated('NCPNotificationTitle.referralQuote') + ' ' + notification.quoteNo + ' '
          + this.utilsService.getTranslated('NCPNotificationTitle.declined')
          : 'Referral Quote ' + notification.quoteNo + ' Declined';

      } else if (notification.notificationType === 'POL') {
        if(notification.noOfPolicies>1){
        notification.title = notification.noOfPolicies + ' ' + (
          this.utilsService.getTranslated('NCPNotificationTitle.policiesAreInDue') ?
            this.utilsService.getTranslated('NCPNotificationTitle.policiesAreInDue') : 'Quotes in held valid for next 7 days');
        }
        else{
          notification.title = notification.noOfPolicies + ' ' + (
          this.utilsService.getTranslated('NCPNotificationTitle.policyInDue') ?
            this.utilsService.getTranslated('NCPNotificationTitle.policyInDue') : 'Quote in held valid for next 7 days');
        }
      } else if (notification.notificationType === 'QT') {
        if(notification.noOfQuotes>1){
        notification.title = notification.noOfQuotes + ' ' +
          (this.utilsService.getTranslated('NCPNotificationTitle.inHeldQuotesExpiringInNext7days') ?
            this.utilsService.getTranslated('NCPNotificationTitle.inHeldQuotesExpiringInNext7days') : 'Policies due expiring in next 7 days');
      }else{
          notification.title = notification.noOfQuotes + ' ' +
          (this.utilsService.getTranslated('NCPNotificationTitle.inHeldQuoteExpiringInNext7days') ?
            this.utilsService.getTranslated('NCPNotificationTitle.inHeldQuoteExpiringInNext7days') : 'Policy due expiring in next 7 days');
      }
    }
    else if (notification.notificationType === 'TSK') 
    {
       notification.title = "NCPLabel.NewTaskHasBeenAddedBy" + notification.addedBy ;

    }else if(notification.notificationType === 'PAY'){
      notification.title = this.utilsService.getTranslated('NCPLabel.pleaseUse') + notification.paymentReferenceNo  + this.utilsService.getTranslated('NCPLabel.forPayingThePremium');
    }
      let date = new Date(notification.updatedDate);
      notification.displayTime = date.toLocaleDateString(this.userLang, { weekday: 'long' }) + ', '
        + date.toLocaleDateString(this.userLang, { day: 'numeric' }) +
        this.getOrdinal(date.getDate()) + ' ' +
        date.toLocaleDateString(this.userLang, { month: 'long' });
    });
    return this.notificationArray;
  }
  getOrdinal(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return this.utilsService.getTranslated('NCPLabel.st') ? this.utilsService.getTranslated('NCPLabel.st') : 'st';
    }
    if (j == 2 && k != 12) {
      return this.utilsService.getTranslated('NCPLabel.nd') ? this.utilsService.getTranslated('NCPLabel.nd') : 'nd';
    }
    if (j == 3 && k != 13) {
      return this.utilsService.getTranslated('NCPLabel.rd') ? this.utilsService.getTranslated('NCPLabel.rd') : 'rd';
    }
    return this.utilsService.getTranslated('NCPLabel.th') ? this.utilsService.getTranslated('NCPLabel.th') : 'th';
  }
  getUpdateDeleteObj(notification) {
    let obj;
    if (notification.notificationType === 'POL') {
      obj = {
        'notifications': {
          'notificationID': this.notificationList.notificationID,
          'policy': notification
        }
      };
    } else if (notification.notificationType === 'QT') {
      obj = {
        'notifications': {
          'notificationID': this.notificationList.notificationID,
          'quote': notification
        }
      };
    } else if (notification.notificationType === 'REF') {
      obj = {
        'notifications': {
          'notificationID': this.notificationList.notificationID,
          'referral': [notification]
        }
      };
    }
      else if (notification.notificationType === 'TSK') {
        obj = {
        'notifications': {
          'notificationID': this.notificationList.notificationID,
          'task': [notification]
        }
      };
    }
    else if (notification.notificationType === 'PAY') {
      obj = {
      'notifications': {
        'notificationID': this.notificationList.notificationID,
        'payment': [notification]
      }
    };
  }
    return obj;
  }

  getNotificationUrl(notification) {
    let notificationUrl;
    if (notification.notificationType === 'REF') {
      // notificationUrl = this.routeJson[notification.productCd]['EQ'];
      notificationUrl = this.utilsService.getProductRoutes(notification.productCd)['EQ'];
    } else if (notification.notificationType === 'POL' || notification.notificationType === 'QT') {
      notificationUrl = 'ncp/activity';
    } else {
      notificationUrl = 'ncp/home';
    }
    return notificationUrl;
  }

  getNotificationCount() {
    let count = this.notificationArray.length;
    this.notificationArray.forEach(notification => {
      if (notification.hasNotificationViewed) {
        count--;
      }
      this.newNotificationCount = count.toString();
    });
    if (!this.newNotificationCount || count < 1) {
      this.newNotificationCount = '';
    }
    return this.newNotificationCount;
  }

};
