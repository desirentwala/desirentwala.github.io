import { CUSTOM_ELEMENTS_SCHEMA, HostListener, Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { Storage } from '@ionic/Storage';
import { IonicStorageModule } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NotificationService } from './common/services/notification.service';
import { MagicLinkService } from './common/services/magic-link/magic-link.service';

import { AppComponent } from './app.component';

describe('Main Component Will Render', () => {
   let component: AppComponent;
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;
  let storage: Storage;
  let notificationService: NotificationService;
  let magicLinkService: MagicLinkService;
  
  
  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        IonicStorageModule.forRoot(),
      ],
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        AndroidPermissions
      ],
    }).compileComponents();
  }));
it("should render ngOnDestroy", () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  let  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnDestroy').and.callFake(() => console.log('fake ngOnDestroy'));
});
it("should render ngOnInit", () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  let  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
});
it("should render initializeApp", () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  let  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'initializeApp').and.callFake(() => console.log('fake initializeApp'));
});
  it('should initialize the method "myBackButton"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.myBackButton).toBeTruthy();
  });
  it('should initialize the method "disableNavigation"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.disableNavigation).toBeTruthy();
  });
  it('should initialize the method "disableNavigation"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.disableNavigation()).toBeUndefined();
  });
  it('should initialize the method "closeAndroidApp"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.closeAndroidApp()).not.toBeNull();
    expect(app.closeAndroidApp()).toBeTruthy();
  });
  it('should initialize the method "disableNavigation"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.disableNavigation()).not.toBeNull();
    window.onpopstate = function() {
      history.go(0);
    };
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.ngOnInit;
    app.magicLinkService.verifyMagicLink(5).subscribe(status => {console.log(status)});
  });
  it('should initialize the method "Storage"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.storage).toBeTruthy();
  });
  it('should initialize the method "ngOnDestroy"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnDestroy).toBeTruthy();
  });
  it('should initialize the method "initializeApp"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    
    const app = fixture.debugElement.componentInstance;
    expect(app.initializeApp).toBeTruthy();
  });

  it('should initialize the method "checkAndroidPermissions"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.checkAndroidPermissions).toBeTruthy();
  });
  it('should initialize the method "platformBack" not to be null', async () => {
    const platform= Platform
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.platformBack()).not.toBeNull();
    expect(app.platformBack()).toBeUndefined();
  });
  it('should initialize the method "checkAndroidPermissions" not to be null', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.checkAndroidPermissions()).not.toBeNull();
  });
  it('should initialize the method "collapseMenuBar"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.collapseMenuBar).toBeTruthy();
  });
  it('should initialize the method "myBackButton"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.myBackButton).toBeTruthy();
  });
  it('should initialize the method "myBackButton" not to be null', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.myBackButton()).not.toBeNull();
  });
  it('should initialize the method "selectNavigation"', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.selectNavigation).toBeTruthy();
  });
  it('should initialize the method "selectNavigation" not to be null', async () => {;
    const navigator = {path:'/home'};
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.selectNavigation(navigator)).not.toBeNull();
  });
  it('should initialize the method "collapseMenuBar" not to be null', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.collapseMenuBar()).not.toBeNull();
  });
  it('checkAndroidPermissions not to be empty', async () => {
    let androidPermissions;
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.checkAndroidPermissions(androidPermissions)).toBeUndefined();
  });
  it('checkAndroidPermissions not to be empty', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
  expect(app.checkAndroidPermissions()).toBe(undefined)
  });
  it('should initialize the method not be null', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.initializeApp()).not.toBeNull();
  });
  it('defaultNavigation not to be empty', async () => {
    const navigator = '/param'
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.defaultNavigation(navigator)).toBeUndefined();
  });
  it('checkAndroidPermissions not to be empty', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
  expect(app.checkAndroidPermissions()).toBe(undefined)
  });
  it('should defaultNavigation the method not be null', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.defaultNavigation(navigator)).not.toBeNull();
    app.router.events.subscribe(event => { console.log(event)});
  });

  // TODO: add more tests!
  it('should set an Item', () => {
    expect(localStorage.getItem.length).toBe(1)
  });
  beforeEach(() => {
    var store = {};
    spyOn(localStorage, 'getItem').and.callFake( (key:string):string => {
     return store[key] || null;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key:string):void =>  {
      delete store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key:string, value:string):string =>  {
      return store[key] = <string>value;
    });
    spyOn(localStorage, 'clear').and.callFake(() =>  {
        store = {};
    });
  });
  it('should use NotificationService', () => {
    let magicLinkService:any;
    let service = TestBed.get(NotificationService);
    expect(service.notification().then(testNotification =>{
      this.magicLinkService.LINK_INVALID_ERROR = testNotification;
    }));
  });
});

