import { environment } from '../../environments/environment';
import { Compiler, DoCheck, ChangeDetectorRef } from '@angular/core';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@adapters/packageAdapter';
import { LocalStorageService } from '@adapters/packageAdapter';
import { Observable, timer } from '@adapters/packageAdapter';
import { take, map } from '@adapters/packageAdapter'
import { UserService } from '../auth/login/services/user/user.service';
import { ConfigService } from './services/config.service';
import { EventService } from './services/event.service';
import { UtilsService } from './ui-components/utils/utils.service';
import { TranslateService } from '@adapters/packageAdapter';


@Component({

  selector: 'app-root',
  templateUrl: './ncpapp.html'
})
export class NcpApp implements OnInit, AfterContentInit, DoCheck {
  config: ConfigService;
  loading: any;
  userService: UserService;
  idleState: boolean = false;
  countdownForTimeOut: any;
  appTitle = "NCP APP";
  appIcon = "./assets/img/favicon.ico";
  loaderType = "";
  idleIntialized: boolean = false;
  displayOfflineModal: boolean = false;
  displaySessionExpiredModal: boolean = false;
  countDown: any;
  appReloadURL: any;
  build: any;
  isLoadingFromLocalStorage: boolean = false;
  constructor(config: ConfigService, _userService: UserService,
    public _compiler: Compiler,
    public localStorage: LocalStorageService,
    public idle: Idle, public event: EventService,
    public util: UtilsService, public translate: TranslateService) {
    this.config = config;
    this.userService = _userService;
    this.config.loggerSub.subscribe(data => {
      if (data === 'configLoaded') {
        this.storeBuildVersionToLocalStorage();
      }
    });
    let brandJsonData = this.config.getCustom('branding');
    if (!brandJsonData) {
      this.config.loggerSub.subscribe((data) => {
        if (data === 'brandingLoaded') {
          brandJsonData = this.config.getCustom('branding');
          this.setAppDetails(brandJsonData);
        }
      });
    } else {
      this.setAppDetails(brandJsonData);
    }
  }

  setAppDetails(brandJsonData) {
    if (brandJsonData) {
      this.appTitle = brandJsonData['ncpApp']['appName'] ? brandJsonData['ncpApp']['appName'] : this.appTitle;
      this.appIcon = brandJsonData['ncpApp']['appIcon'] ? brandJsonData['ncpApp']['appIcon'] : this.appIcon;
      this.loaderType = brandJsonData['ncpApp']['loader'] ? brandJsonData['ncpApp']['loader'] : this.loaderType;
    }
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link['type'] = 'image/x-icon';
    link['rel'] = 'shortcut icon';
    link['href'] = this.appIcon;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  ngOnInit() {
    this.config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.config.currentLangName);
      }
    });
    this._compiler.clearCache();
    this.userService.isExternalUser();
    this.build = environment.country;
    this.config.loadingSub.subscribe((data) => {
      this.loading = data;
    });
    this.event.errorSub.subscribe((data) => {
      if (data['id'] === 'logError') {
        this.config.processErrors(data['value']);
        if (data['value'] && data['value']['eventType'] && data['value']['eventType'] === 'unAuthorized') {
          this.displaySessionExpiredModal = true;
          this.appReloadURL = this.config.getCustom('appLoadingUrl');
        }
      }
    });

    this.config.loggerSub.subscribe(data => {
      if (data === 'netWorkOffline' && !this.displaySessionExpiredModal) {
        this.displayOfflineModal = true;
        this.ngDoCheck();
      }
      if (data === 'sessionExpired') {
        this.displaySessionExpiredModal = true;
        this.displayOfflineModal = false;
        this.appReloadURL = this.config.getCustom('appLoadingUrl');
      }
      if (data === 'reloadingScreen') {
        this.isLoadingFromLocalStorage = true;
      }
    });
    if (!this.config.getCustom('b2cFlag') && !this.config.getCustom('b2b2cFlag') && !this.config.getCustom('isExternalUser')) {
      window.addEventListener("hashchange", this.funcRef, false);
    }
    this.config.enableRefreshCheck();
  }

  funcRef() {
    let type = localStorage.getItem('type');
    if (type) {
      this.isLoadingFromLocalStorage = true;
      location.href = (localStorage.getItem('url'));
      location.reload(true);
    } else {
      location.replace("/login");
      location.reload(true);
    }
  }

  ngAfterContentInit() {
    let loginSub = this.userService.getLoggedIn();
    loginSub.subscribe(() => {
      if (this.userService.isLoggedIn()) {
        localStorage.setItem('type', this.config.getCustom('b2cFlag') ? this.config.getCustom('b2cFlag') : this.config.getCustom('b2b2cFlag'));
        let url: string = this.config.getCustom('appLoadingUrl');
        localStorage.setItem('url', url);
      }
      if (this.userService.isLoggedIn() && !this.idleIntialized) {
        // sets an idle timeout of 5 seconds, for testing purposes.
        this.idle.setIdle(parseInt(this.config.get('idleCheckPeriod')) ? parseInt(this.config.get('idleCheckPeriod')) : 3600);
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        this.idle.setTimeout(parseInt(this.config.get('timeOutAfterIdle')) ? parseInt(this.config.get('timeOutAfterIdle')) : 20);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.idleIntialized = true;
        this.idle.onIdleEnd.subscribe(() => this.idleState = false);
        this.idle.onTimeout.subscribe(() => {
          if (this.config.getCustom('b2cFlag')) {
            this.config.navigateRouterLink('/b2c');
            this.userService.setLoggedIn();
          } else if (this.config.getCustom('b2b2cFlag')) {
            this.config.navigateRouterLink('/b2b2c');
            this.userService.setLoggedIn();
          } else if (this.config.getCustom('firstLoginFlag')) {
            this.config.navigateRouterLink('/firstLogin');
            this.userService.setLoggedIn();
          } else if (this.config.getCustom('isExternalUser')) {
            this.userService.setLoggedIn();
          } else {
            this.userService.logoutUser();
          }
          this.idleState = false;
          this.idleIntialized = false;
        });
        this.idle.onIdleStart.subscribe(() => {
          this.idleState = true;
        });
        this.idle.onTimeoutWarning.subscribe((countdown) => this.countdownForTimeOut = countdown);
        this.idle.watch();
      }
    });

  }
  storeBuildVersionToLocalStorage() {
    let redirectTo = location.href;
    let buildVersion = this.config.get('buildVersion');
    let buildNoFromLS = this.localStorage.get('BuildNo');
    if (buildNoFromLS === null || buildNoFromLS === undefined) {
      this.localStorage.set('BuildNo', buildVersion);
    } else {
      if (buildNoFromLS !== buildVersion) {
        this.localStorage.clearAll();
        this.localStorage.set('BuildNo', buildVersion);
        location.reload(true);
        location.href = '#';
      }
    }
  }
  ngDoCheck() {
    if (!navigator.onLine) {
      if (!this.displayOfflineModal && !this.displaySessionExpiredModal) {
        this.displayOfflineModal = true;
        let expiryTime = this.config.getRemaningTimeOnJwt();
        expiryTime = Math.ceil(expiryTime / 1000);
        this.config.setLoadingSub('no');
        this.countDown = timer(0, 1000)
          .pipe(take(expiryTime))
          .pipe(map(() => --expiryTime));
      }
    } else {
      this.displayOfflineModal = false;
    }
  }

  reloadApplication() {
    location.href = (this.appReloadURL);
    location.reload(true);
  }
}