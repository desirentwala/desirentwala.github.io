import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';

import { IonRouterOutlet, Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonService } from './common/services/common.service';
import { BusyIndicatorService } from './common/services/busy-indicator.service';
import { Subscription, interval } from 'rxjs';
import { Location } from '@angular/common';
import { MagicLinkService } from './common/services/magic-link/magic-link.service';
import { NotificationService } from './common/services/notification.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  routeList: any = new Array<any>();
  public isMobile: boolean;
  public isBusy: boolean;
  private loaderSubscription: Subscription;
  private unSubscribeBackButton: Subscription;
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;
  /**
   * HostListener to disable browser back button
   */
  @HostListener('window:popstate')
  defaultNavigation() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (localStorage.getItem('accessToken') && localStorage.getItem('result')) {
          if(this.commonService.getStorage){
            const role = this.commonService.getStorage['userroles.role.roleName'];
            switch (role) {
              case 'PO':
                if ((event.url === '/pets/dashboard') || (event.urlAfterRedirects === '/pets')) {
                  this.disableNavigation();
                }
                break;
              case 'VET':
                if ((event.url === '/vetpractice/dashboard') || (event.urlAfterRedirects === '/vetpractice')) {
                  this.disableNavigation();
                }
                break;
              case 'PA':
                if ((event.url === '/practiceadmin/dashboard') || (event.urlAfterRedirects === '/practiceadmin')) {
                  this.disableNavigation();
                }
                break;
              case 'VHDA':
                if ((event.url === '/vhdadmin/dashboard') || (event.urlAfterRedirects === '/vhdadmin')) {
                  this.disableNavigation();
                }
                break;
              default:
                break;
            }
          }
         
        }
      }
    });
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    public router: Router,
    private commonService: CommonService,
    private location: Location,
    private loaderService: BusyIndicatorService,
    private activeRoute: ActivatedRoute,
    private magicLinkService: MagicLinkService,
    private notificationService: NotificationService,
    private androidPermissions: AndroidPermissions,
    private storage: Storage,
    public alertCtrl: AlertController
  ) {
    // this.initializeApp();
    if (this.commonService.getStorage) {
    }
    this.platformBack();
  }

  ngOnInit(): void {
    this.loaderSubscription = this.loaderService.getStatus().subscribe(status => setTimeout(() => {
      (this.isBusy = status);
    }));

    let target = '/';
    this.activeRoute.queryParams.subscribe(
      params => {
        if (this.magicLinkService.initMagicLink(params)) {
          this.magicLinkService.verifyMagicLink(+params.n, params.r).subscribe(status => {
            if (status) {
              this.notificationService.notification(this.magicLinkService.LINK_INVALID_ERROR , 'danger');
            } else {
              if (localStorage.getItem('accessToken') && localStorage.getItem('result')) {
                target = this.magicLinkService.linkTragetRoute;
                this.router.navigateByUrl(target);
              }
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.loaderSubscription.unsubscribe();
    this.unSubscribeBackButton.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (cordova && cordova.platformId === 'ios') {
        this.statusBar.styleLightContent();
      } else {
        this.statusBar.styleDefault();
      }
      this.splashScreen.hide();
      this.checkAndroidPermissions();
    });
    // get router list on role basis
    this.commonService.routesObservable.subscribe(res => {
      this.routeList = res.routeList;
    });
    // Checking device
    if (navigator.userAgent.match(/Android/i)
      // || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    // on first run or if no permissions granter before for the mobile resources request and check before proceeding
  }

  public checkAndroidPermissions() {
    // --------- STORAGE PERMISSIONS
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?', result.hasPermission),
      err => {
        console.log('Storage read permission check err: ', err);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
      }
    );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?', result.hasPermission),
      err => {
        console.log('Storage write permission check err: ', err);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      }
    );
    // --------- CAMERA PERMISSIONS
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?', result.hasPermission),
      err => {
        console.log('Camera permission check err: ', err);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
      }
    );
    // --------- MIC INPUT PERMISSIONS
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.RECORD_AUDIO]);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
      result => console.log('Has permission?', result.hasPermission),
      err => {
        console.log('Mic permission check err: ', err);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO);
      });
  }

  // collapsing the sidemenu bar
  collapseMenuBar() {
    this.menu.close();
  }

  // back button
  myBackButton() {
    this.location.back();
  }

  // menu navigation
  selectNavigation(navigation) {
    if(navigation){
      this.router.navigate([`/${navigation.path}/`]);
    }
  }

  disableNavigation(): void {
    history.pushState(null, null, location.href);
    // tslint:disable-next-line:only-arrow-functions
    window.onpopstate = function () {
      history.go(0);
    };
  }

  platformBack(): void {
    this.platform.ready().then(() => {
      document.addEventListener('backbutton', () => {
        if (this.router.url === '/pets/dashboard' ||
          this.router.url === '/vetpractice/dashboard' ||
          this.router.url === '/practiceadmin/dashboard' ||
          this.router.url === '/vhdadmin/dashboard') {
          this.unSubscribeBackButton = this.platform.backButton.subscribeWithPriority(999999, () => {
            this.closeAndroidApp();
          });
        } else {
          if (this.unSubscribeBackButton) {
            this.unSubscribeBackButton.unsubscribe();
          }
          return false;
        }
      });
    });
  }

  async closeAndroidApp() {
    const alert = await this.alertCtrl.create({
      header: 'Do you really want to quit?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }
}
