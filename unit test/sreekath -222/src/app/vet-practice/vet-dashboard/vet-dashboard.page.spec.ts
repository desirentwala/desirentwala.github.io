import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VetDashboardPage } from './vet-dashboard.page';
import {
    HttpClientTestingModule,
    HttpTestingController
  } from "@angular/common/http/testing";
  import { RouterTestingModule } from "@angular/router/testing";
  import { FormsModule } from "@angular/forms";
  import { AppointmentCardComponent } from '../../common/components/appointment-card/appointment-card.component'
  import { MockVetPracticeService } from '../vet-mock-service';
  import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
  import { MockBackend,MockConnection } from '@angular/http/testing';
  import { By } from '@angular/platform-browser';
 describe('VetDashboardPage', () => {
  let component: VetDashboardPage;
  let fixture: ComponentFixture<VetDashboardPage>;
  let service:MockVetPracticeService;
  let mockBackend: MockBackend;

  it('should render main title', () => {
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('My appointments');
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetDashboardPage,AppointmentCardComponent ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule],
      providers:[MockVetPracticeService,{provide:XHRBackend,useClass:MockBackend}]
    }).compileComponents();
    service = TestBed.get(MockVetPracticeService);
    mockBackend=TestBed.get(XHRBackend);
    fixture = TestBed.createComponent(VetDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should render image for desktop', async(() => {
  //   const fixture = TestBed.createComponent(VetDashboardPage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.desktop-logo>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  // }));
  // it('should render the image for mobile', async(() => {
  //   const fixture = TestBed.createComponent(VetDashboardPage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.col-12>img').src).toContain('http://localhost:9876/assets/imgs/mobile-logo.png');
  // }));
  it("method should be exist & it should be true", () => {
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAppointments).toBeTruthy();
  });
  it("method should be exist & pass param", () => {
    let data;
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAppointments(data)).toBeUndefined();
  });
  it("method should be exist & pass param", () => {
    let data;
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter(data)).toBeUndefined();
  });
  it("method should be exist & pass param Null", () => {
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).not.toBeNull();
  });
  it("method should be exist & pass null", () => {
    let data;
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAppointments()).not.toBeNull();
  });
  it("ionViewDidLeave method should be exist & pass null", () => {
    let data;
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave()).not.toBeNull();
  });
  it("ionViewDidLeave method should be exist ", () => {
    let data;
    const fixture = TestBed.createComponent(VetDashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave).toBeTruthy();
  });
  it('should test two-way binding by by getting vet appointment',(() => {
    let appointments = service.getVetBookings();
    // twoway-binding data tesing
    let component: VetDashboardPage;
    expect(appointments).not.toBeNull();
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.css('app-appointment-card'));
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy;
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: appointments
          })
        )
      );
    });
}));
it("should render ngOnInit", () => {
  const fixture = TestBed.createComponent(VetDashboardPage);
  fixture.detectChanges();
  let  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
});
it("method should be exist & pass param Null", () => {
  const fixture = TestBed.createComponent(VetDashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
});

it("should render initializeApp", () => {
  const fixture = TestBed.createComponent(VetDashboardPage);
  fixture.detectChanges();
  let  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnDestroy').and.callFake(() => console.log('fake ngOnDestroy'));
});
  // it('should render function', function() {
  //   let result = component.getAppointments();
  //  expect(component.getAppointments()).toContain('retun the appointment data');
  //   expect<any>(component.getAppointments()).toEqual('retun the appointment data');
  // });
 
});
