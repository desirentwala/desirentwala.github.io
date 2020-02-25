import { async, ComponentFixture, TestBed,fakeAsync,tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { VideosessionLandingPage } from './videosession-landing.page';
import { OnlineconsultationService } from '../onlineconsultation.service';
import {DebugElement} from "@angular/core"; 
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

describe('Video LandingPage will render', () => {
  let component: VideosessionLandingPage;
  let fixture: ComponentFixture<VideosessionLandingPage>;
  let Mockservice:OnlineconsultationService;
  let el: DebugElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosessionLandingPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule],
      providers: [OnlineconsultationService,AndroidPermissions]
    }).compileComponents();

    fixture = TestBed.createComponent(VideosessionLandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("expects hardwareTesting should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.hardwareTesting).toBeTruthy();
  });
  it("expects hardwareTesting should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.hardwareTesting()).not.toBeNull();
  });
  it('should initialize the method "checkAndroidPermissions"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.checkAndroidPermissions).toBeTruthy();
  });
  it('should initialize the method "checkAndroidPermissions" not to be null', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.checkAndroidPermissions()).not.toBeNull();
  });
  it('should initialize the method "checkAndroidPermissions" not to be null', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.checkAndroidPermissions()).toBeUndefined();
  });
  it('should initialize the method "audioText"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.audioText).toBeTruthy();
  });
  it('should initialize the method "audioText" not to be null', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.audioText()).not.toBeNull();
  });
  it('should initialize the method "audioText" not to be null', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.audioText()).toBeUndefined();
  });
  it('should initialize the method "presentLoading"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.presentLoading).toBeTruthy();
  });
  it('should initialize the method "videocam"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.videocam).toBeTruthy();
  });
  it('should initialize alret method "videocam"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.videocam()).not.toBeNull();
  });
  it('should initialize the method "mic"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.mic).toBeTruthy();
  });
  it('should initialize alret method "mic"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.mic()).not.toBeNull();
  });
  it('should route the method "startSession"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.startSession).toBeTruthy();
  });
  it('should route method as asigned path "startSession"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.startSession()).not.toBeNull();
  });
  it('should route the method "cancelVideoCall"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.cancelVideoCall).toBeTruthy();
  });
  it('should route method as asigned path "cancelVideoCall"', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.cancelVideoCall()).not.toBeNull();
  });
  it('should initialize the method "presentLoading" not to be null', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.presentLoading()).not.toBeNull();
  }); 
  it('should initialize the method "showSettings" not to be null', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.showSettings).toBeTruthy();
  }); 
  it('should initialize the method "showSettings" not to be null', async () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.showSettings()).not.toBeNull();
  }); 
  
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(VideosessionLandingPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
});
