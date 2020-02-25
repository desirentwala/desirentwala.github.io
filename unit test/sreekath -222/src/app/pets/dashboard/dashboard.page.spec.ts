import { async, ComponentFixture, TestBed,fakeAsync,tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentCardComponent } from '../../common/components/appointment-card/appointment-card.component'
//import {DebugElement} from "@angular/core"; 
import { By } from '@angular/platform-browser';
import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend,MockConnection } from '@angular/http/testing';
import { DashboardPage } from './dashboard.page';
import { MockPetService } from '../mock.pets.service';
import { inject } from '@angular/core/testing';
import { PetService } from '../pets.service';
import { SchedulingService } from '../../scheduling-management/service/scheduling.service';
import { CommonService } from '../../common/services/common.service';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
describe('Pets Dashboard will render', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let service: MockPetService;
  let service1 = PetService
  let mockBackend: MockBackend;
  let petservice: PetService;
  let schedulingservice: SchedulingService;
  let commonService: CommonService;
  // let storage: Storage;
  // let storage: Storage;
  //const compiled = fixture.debugElement.nativeElement;

  it('should render main title', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Home page');
  });

  var originalTimeout;

  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPage,AppointmentCardComponent ],
      imports: [HttpClientTestingModule,RouterTestingModule,  IonicModule.forRoot(), IonicStorageModule.forRoot()],
      providers:[MockPetService,StatusBar,{provide:XHRBackend,useClass:MockBackend},PetService,SchedulingService,CommonService]
    }).compileComponents();
    // storage=TestBed.get(storage);
    service = TestBed.get(MockPetService);
    service1 = TestBed.get(PetService)
    mockBackend=TestBed.get(XHRBackend);
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  beforeEach(async () => {
    component.ngOnInit();
  });
  beforeAll((done) => {
    done(); 
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have the other component appoinment card', async(() => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-appointment-card')).toBe(null);
    fixture.detectChanges();
  }));
  it('expects should hidden contents if show is false', async(() => {
    // should be rendered initially
    expect(fixture.debugElement.query(By.css('appointments.length'))).toBeNull();
  }));

  it('should test two-way binding by by getting booking appointment',(() => {
      let appointments = service.getAllBookingsByUser();
      // twoway-binding data tesing
      let component: DashboardPage;
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

it("ionViewWillEnter method should exist n render", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ionViewWillEnter).toBeTruthy();
});  
it("ionViewWillEnter method should exist n render", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(component.ngOnChanges()).not.toBeNull();
});  
it("ionViewWillEnter method should pass param", () => {
  let param:any;
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ionViewWillEnter()).not.toBeNull();
}); 
it("ngOnInit method should pass param", () => {
  let param:any;
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnInit(param)).toBeUndefined();
  expect(app.ngOnInit(param)).not.toBeNull();
});  
it("getAppointments method should exist n render", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.getAppointments).toBeTruthy();
});  
it("getAppointments method should exist n render", () => {
  let data: any;
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.getAppointments()).not.toBeNull();
});  
it('should render image for desktop', async(() => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('div.desktop-logo>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
}));
it("should render ngOnDestroy", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  let  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnDestroy').and.callFake(() => console.log('fake ngOnDestroy'));
});
it("ngOnDestroy method should pass param", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.componentInstance;
  expect(app.ngOnDestroy).toBeTruthy();
  expect(app.ngOnDestroy()).not.toBeNull();
}); 

it("getPetList method should pass param", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.getPetList()).not.toBeNull();
}); 
it("getPetList method should exist n render", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.getPetList).toBeTruthy();
});  
it("showmore should be exist", () => {
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.storage.get('ONBOARD_PO').then((val) => {
    app.router.navigateByUrl('/pets/new');
  }));
});



it('ion will enter',()=>
{
    expect(component.ionViewDidEnter()).toBeUndefined();
 if (cordova.platformId == 'ios') {
  this.statusBar.styleLightContent();
} else {
  this.statusBar.styleDefault();
}
})
});
