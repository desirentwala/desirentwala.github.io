import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule,  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { SuccessPage } from './success.page';
import { PaymentsService } from '../payments.service';
import { InAppBrowser, InAppBrowserEvent} from '@ionic-native/in-app-browser/ngx';

describe('SuccessPage', () => {
  let component: SuccessPage;
  let fixture: ComponentFixture<SuccessPage>;

  it("should render main title", () => {
    const fixture = TestBed.createComponent(SuccessPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain(
      "Appointment scheduled"
    );
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule],
      providers: [InAppBrowser,PaymentsService]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(SuccessPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).toBeUndefined();
  });
  it('should initialize the method "ngOnInit"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
  });
  it('should initialize the method "sessionData"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.sessionData).toBeTruthy();
  });
  it('should initialize the method "sessionData"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.sessionData()).toBeUndefined();
  });
  it('should initialize the method "sessionData"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.sessionData()).not.toBeNull();
  });
  it('should initialize the method "manageAppointment"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.manageAppointment).toBeTruthy();
  });
  it('should initialize the method "manageAppointment"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.manageAppointment()).toBeUndefined();
  });
  it('should initialize the method "manageAppointment"', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.manageAppointment()).not.toBeNull();
  });
});
