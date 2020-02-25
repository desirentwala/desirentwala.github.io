import { async, ComponentFixture, TestBed,fakeAsync,tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewPage } from './view.page';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from '../../common/services/common.service';
import { By } from '@angular/platform-browser';
import { AppointmentCardComponent } from '../../common/components/appointment-card/appointment-card.component'
import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend,MockConnection } from '@angular/http/testing';
import { MockPetService } from '../mock.pets.service';
import { PetService } from '../pets.service';
import { Pet } from '../pet.model';
import { AlertController } from '@ionic/angular';

describe('petview page should render', () => {
  let component: ViewPage;
  let fixture: ComponentFixture<ViewPage>;
  let service: MockPetService;
  let mockBackend: MockBackend;
  let pet = new Pet();
  let alertController: AlertController;

  it('should render main title', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain("'s details");
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPage,AppointmentCardComponent ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule,FormsModule],
      providers:[MockPetService,{provide:XHRBackend,useClass:MockBackend},AlertController,PetService]
    }).compileComponents();

    service = TestBed.get(MockPetService);
    mockBackend=TestBed.get(XHRBackend)
    fixture = TestBed.createComponent(ViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('appointments should exist', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAppointments).toBeTruthy();
  });
  it('appointments should exist and failed', () => {
    let data:any
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAppointments(data)).toBeUndefined();
  });
  it('pet model should exist', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.pet).toBeTruthy();
  });
  it('petSerVice should exist render', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   app.PetService
    app.petService.getPetById(5).subscribe((petDetails: any) => {
      app.petDetails = petDetails;
      app.pet = this.petDetails;
      app.petService.getAppointmentsByPet(5).subscribe((res: any) => {
        app.apptArr = res;
        app.getAppointments();
      });
    });
  });
 
  it('booking button navigation should be true', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    spyOn(component,'handleBookingButton').and.callThrough();
   // spyOn(component.handleBookingButton(pet),'hide').and.callThrough();
    //expect(app.handleBookingButton()).toBeUndefined();
   // expect(app.handleBookingButton()).not.toBeNull();
  });
  it('booking button navigation should be true', () => {
    const pet = {id: 12};
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.handleBookingButton(pet)).not.toBeNull();
  });
 
  it('should exist Showmenthod', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showPet).toBeTruthy();
  });
  it('should exist deletePet method', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.deletePet).toBeTruthy();
  });
  it('should exist presentAlertConfirm method', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.presentAlertConfirm).toBeTruthy();
  });
  it('should exist basePath method', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.basePath).toBeTruthy();
  });
  it('should exist presentAlertConfirm method unidefined', () => {
    let data:any
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.presentAlertConfirm(data)).toBeTruthy();
  });
  
  it('should exist deletePet fail', () => {
    let id :any
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.deletePet(id)).toBeUndefined();
  });
  it('should exist Showmenthod', () => {
    let data:any;
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showPet(data)).toBeUndefined();
  });
  it('should exist startVideoSession', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.startVideoSession).toBeTruthy();
  });
  it('should exist startVideoSession redireTo', () => {
    let url:any;
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.startVideoSession(url)).toBeUndefined();
  });
  it('should exist editPet', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editPet).toBeTruthy();
  });
  it('should exist editPet redireTo', () => {
    const id = {'petDetails': 12};
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editPet(id)).toBeUndefined();
  });
  it('should exist hide intiall', () => {
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.hidePet).toBeTruthy();
  });
  it('should exist hide pass param', () => {
    let data:any;
    const fixture = TestBed.createComponent(ViewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.hidePet(data)).toBeUndefined();
  });
  beforeEach(async () => {
    component.ngOnInit();
  });
  it('should show the profiel pic', () => {
    expect(fixture.debugElement.query(By.css('.my-auto'))).toBeNull();
  });

  it('expects should hidden contents if show is false', async(() => {
    // should be rendered initially 
    expect(fixture.debugElement.query(By.css('appointments.length'))).toBeNull();
   // expect(appointments.length).toBeGreaterThanOrEqual(1);
  }));
  it('should test two-way binding by setting the component member', 
  fakeAsync(() => {
      let appointments: any =[
       {
        'id': 25,
        'userId': 6,
        'petId': 2,
        'bookingId': 10031,
        'notes': null,
        'createdOn': "2019-12-18T07:35:16.000Z"
       } 
      ];
      // twoway-binding data tesing
      let component: ViewPage;
      fixture.detectChanges();
      tick();
     // let de:DebugElement;
     // let de:DebugElement = new DebugElement();
      const de = fixture.debugElement.query(By.css('app-appointment-card'));
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy;
    //  de = fixture.debugElement.query(By.css('h1'));
    //  expect(fixture.debugElement.query(By.css('app-appointment-card')).nativeElement.value).toEqual(appointments.value)
   }));
   it('should test two-way binding by by getting booking appointment',(() => {
   // let petId: any;
    let appointments = service.getAppointmentsByPet();
    let component: ViewPage;
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
 it('assigning for model',()=>
 {
 const mod=component.pet;
 mod.id=1;
 mod.userId=121212;
 mod.petName =  'alexa';
 mod.speciesId = 2312312;
 mod.practiceId = 23423443;
 mod.practice = 'apllo clinic';
 mod.breed = 'biscut';
 mod.gender =  'male';
 mod.dob = new Date;
 mod.profilePic = 'image.png';
 mod.neutered = true;
 mod.deceased = false;
 mod.hide = true;
 mod.active = false;
 mod.insured= true;
 mod.insurenceProvider = 'yes';
 expect(mod.id).toBe(1);
 expect(mod).not.toBeNull();
  expect(mod.userId).toBe(121212);
 //   appointments: Array<any> = [];
 //   slot: { id: number, isPrivate: boolean, vet: string, duration: string, startsAt: string,
 //     practiceAppointmentTypeId: number, appointmentType: string, originalDateTime: any };
 //   oldSlotId?: number;
 // practiceName: any;
 
 });

});
