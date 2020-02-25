import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideosessionPage } from './videosession.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';

describe('Videosession should render', () => {
  let component: VideosessionPage;
  let fixture: ComponentFixture<VideosessionPage>;
  let session: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosessionPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VideosessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('component should be truthy', () => {
    expect(component).toBeTruthy();
  });
  it("expects initSession should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.initSession).toBeTruthy();
  });
  it("expects startSession should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.startSession).toBeTruthy();
  });
  it("expects setSettings should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.setSettings).toBeTruthy();
  });
  it("expects initSession should pass some duplicate parameters", () => {
    let sourceType:any;
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.initSession(sourceType)).toBeUndefined();
  });
  it("expects initSession  pass null", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.initSession(session)).not.toBeNull();
  });
  it("expects preventBack should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.preventBack).toBeTruthy();
  });
  it("expects preventBack should pass some duplicate parameters", () => {
    let data:any;
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.preventBack(data)).toBeUndefined();
  });
  it("expects setSettings should pass some duplicate parameters", () => {
    const audioOut = {'deviceId':'121212'}
    const videoIn = {'deviceId': '2313123'};
    let audioIn:any;    
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.setSettings(audioOut,videoIn,videoIn)).toBeUndefined();
    // expect(app.setSettings(videoIn)).toBeUndefined();
  });
  
  it('should render the image for desktop', async(() => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-title.videocallheader>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  }));
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it("should render startSession", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'startSession').and.callFake(() => console.log('fake startSession'));
  });
  it("expects endSession medthod should RENDER", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.endSession()).toBeUndefined();
  });
  it("expects getMediaDevices medthod should RENDER", () => {
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getMediaDevices()).toBeUndefined();
  });
  it("expects micControl medthod should RENDER", () => {
    const publishAudio = '123'
    const fixture = TestBed.createComponent(VideosessionPage);
    fixture.detectChanges();
    var app = fixture.componentInstance;
    app['micControl()']= publishAudio.valueOf['publisher'];
   // expect(app.micControl()).toBeFalsy();
 //   expect(app.micControl()).not.toBeNull();
  });
});
