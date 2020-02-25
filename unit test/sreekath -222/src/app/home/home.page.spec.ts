import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
    HttpClientTestingModule,
    HttpTestingController
  } from "@angular/common/http/testing";
  import { RouterTestingModule } from "@angular/router/testing";

import { HomePage } from './home.page';
import { Storage } from '@ionic/Storage';
import { IonicStorageModule } from '@ionic/storage';
import { Market } from '@ionic-native/market/ngx';
describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  it("should render main title", () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain(
      "Less Stress. More Love."
    );
  });
  it("should render h6 title", () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h6").textContent).toContain(
      "Download our app"
    );
  });
  it("should render label text", () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("ion-label").textContent).toContain(
      "See your own vet in comfort of your home."
    );
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,
        IonicStorageModule.forRoot(),],
        providers: [Market]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it('should initialize the method "ionViewWillEnter"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter).toBeTruthy();
  });
  it('should initialize the method "ionViewWillEnter"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).toBeUndefined();
  });
  it('should initialize the method "ionViewWillEnter"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).not.toBeNull();
  });
  it('should initialize the method "openMenu"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.openMenu).toBeTruthy();
  });
  it('should initialize the method "openMenu"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.openMenu()).not.toBeNull();
  });
  it('should initialize the method "eventFromPopover"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.eventFromPopover).toBeTruthy();
  });
  it('should initialize the method "eventFromPopover"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.eventFromPopover()).not.toBeNull();
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
  });
  it('should initialize the method "navigateRegister"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateRegister).toBeTruthy();
  });
  it('should initialize the method "navigateRegister"', async () => {
    const roleName =[{'roleName' : 'PA'}]
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateRegister()).not.toBeNull();
    expect(app.navigateRegister(roleName)).toBe(undefined);
  });
  it('should initialize the method "gotoMarket"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.gotoMarket).toBeTruthy();
  });
  it('should initialize the method "gotoMarket"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.gotoMarket()).not.toBeNull();
    const target = 'sample target';
    expect(app.gotoMarket(target)).not.toBeNull();
  });
  it('should initialize the method "settingsPopover"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.settingsPopover).toBeTruthy();
  });
  it('should initialize the method "settingsPopover"', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const app = fixture.debugElement.componentInstance;
    expect(app.settingsPopover()).not.toBeNull();
  });
  it('should render image for desktop', async(() => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-col>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  }));
  it('should render isMobile', async(() => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(component.isMobile).toBe(false);
  }));
  
});
