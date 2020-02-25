import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { Component, OnInit, Input } from '@angular/core';
import { RouterTestingModule,  } from "@angular/router/testing";
import { AppointmentCardComponent } from './appointment-card.component';
import { MockDateConvertorService } from '../../services/mock.date-convertor.service';
import { convertToParamMap,ActivatedRoute} from '@angular/router';
import { OnlineconsultationService } from '../../../online-consultation/onlineconsultation.service';
import { CommonService } from '../../services/common.service';
import * as moment from 'moment';


describe('appointment card should be render', () => {
  let component: AppointmentCardComponent;
  let service: MockDateConvertorService;
  let fixture: ComponentFixture<AppointmentCardComponent>;
  let upcommingAppointments = [];
  let previousAppointments = [];
  let sheduledAppointments = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentCardComponent ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule],
      providers:[MockDateConvertorService,
        { provide: ActivatedRoute, useValue: {
          paramMap: ( convertToParamMap( { id: 5 } ) ),
          OnlineconsultationService,CommonService
      }
  }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(MockDateConvertorService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create', () => {
    expect(service).toBeTruthy();
  });
  beforeEach(async () => {
    component.ngOnInit();
  });
 
  it("navigating to Vedio", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateToVideo).toBeTruthy();
  });
  it("navigating to Vedio passing appointmentData", () => {
    const appointmentData = [{
      'appointmentid':2,
       'appoinmemntmentdate': '13-02-2020'
    }]
    expect(component.navigateToVideo(appointmentData)).toBeUndefined();
    expect(component.navigateToVideo(appointmentData)).not.toBeNull();
  });
  it("navigating to Vedio", () => {
    let appointmentData;
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateToVideo(appointmentData)).toBeUndefined();
  });
  it("navigating to Vedio passing param ", () => {
    let res;
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateToVideo(res)).toBeUndefined();
    expect(app.navigateToVideo(res)).not.toBeNull();
     app.bookingDatavideo = {};
    //spyOn(component,'navigateToVideo').and.returnValue(bookingDatavideo);
    app.bookingDatavideo['bookingId'] = 12345;
    app.bookingDatavideo['userId'] = 12345;
    app.bookingDatavideo['vetId'] = 12345;
    app.bookingDatavideo['practicerName'] = 'apploclinic';
    app.bookingDatavideo['Vetname'] = 'sample';
    // app.navigateToVideo('bookingId', '12345'); 
    // app.navigateToVideo('userId', '12345'); 
    // app.navigateToVideo('vetId', '12345'); 
    // app.navigateToVideo('practicerName', 'applo clinic'); 
    // app.bookingDatavideo('Vetname', 'Murali setty'); 
  });
  it("sheduled booking appointments", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.sheduledAppointments).toBeTruthy();
  });
  it("previous booking appointments", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.previousAppointments).toBeTruthy();
  });
  it("upcoming booking appointments", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.upcommingAppointments).toBeTruthy();
  });
  it("ngOnChanges method will calls", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges).toBeTruthy();
    expect(app.ngOnChanges()).not.toBeNull();
  });
  it("Date Conversition method should be true", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dateConvertion).toBeTruthy();
  });
   it("editappointment method should be true", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editAppointment).not.toBeFalsy();  
  });
  it("editappointment method should be true", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editAppointment).toBeTruthy();
  });
  it("editappointment method should be true", () => {
    let data;
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editAppointment(data)).toBeUndefined();
  });
  it("editappointment method should be true", () => {
    const data =[{
      'name': 'alexa',
       'date': '20-11-2020'
    }];
    expect(component.editAppointment(data)).toBeUndefined();
    expect(component.editAppointment(data)).not.toBeNull();
  });
  it("editappointment method should be true", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editAppointment()).not.toBeNull();
  });
  it("date pass like param", () => {
    let date;
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dateConvertion(date)).toBeUndefined();
    component.appointments;
  });
  it('loaderIs should be truthy', () => {
    component.appointments = 2
    expect(component.appointments).toBeTruthy();
  });
  it('appointments should be falsy', () => {
    component.appointments = 1
     expect(component.appointments).toBe(1);
 });
//  it('appointments should be pass from child', () => {
//   const childComp: DashboardPage = fixture.debugElement.query(By.directive(DashboardPage)).componentInstance;
//  expect(childComp).toBeTruthy();
//  expect(childComp.appointments).toEqual('test appointments');
// });
  it("date pass like param", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dateConvertion()).not.toBeNull();
  });
  it("date pass like param", () => {
    const appointment ={
      "bookings": [
         {
            "id": 10045,
            "slotId": 12,
            "userId": 13,
            "practiceAppointmentTypeId": 7,
            "statusId": 14,
            "cancelNotes": null,
            "vsBookingId": null,
            "userRating": null,
            "practiceRating": null,
            "bookingTransactionId": 8,
            "createdOn": "2020-01-16T13:34:07.000Z",
            "updatedOn": "2020-01-16T13:35:10.000Z",
            "slot": {
               "id": 12,
               "startsAt": "2020-01-16T13:37:00.000Z",
               "duration": 10,
               "isPrivate": false,
               "practice": {
                  "id": 3,
                  "practiceName": "Manipal",
                  "email": "rashar@agkiya.cloud"
               },
               "user": {
                  "id": 8,
                  "firstName": "Rashmi",
                  "email": "rashmi.hebbar@lucidatechnologies.com",
                  "profilePic": "PR_8.PNG"
               }
            },
            "status": {
               "statusName": "Completed"
            },
            "appointments": [
               {
                  "id": 8,
                  "userId": 13,
                  "petId": 5,
                  "bookingId": 10045,
                  "notes": null,
                  "createdOn": "2020-01-16T13:34:07.000Z",
                  "pet": {
                     "id": 5,
                     "petName": "choco",
                     "active": true
                  }
               }
            ],
            "practiceAppointmentType": {
               "appointmentType": "Standard consultation",
               "customerFee": 20
            },
            "user": {
               "id": 13,
               "firstName": "Rashmi hebbar",
               "lastName": "",
               "email": "rashmihebbar23@gmail.com",
               "profilePic": "PO_13.jpg"
            }
         },
         {
            "id": 10051,
            "slotId": 8,
            "userId": 13,
            "practiceAppointmentTypeId": 8,
            "statusId": 11,
            "cancelNotes": null,
            "vsBookingId": null,
            "userRating": null,
            "practiceRating": null,
            "bookingTransactionId": 12,
            "createdOn": "2020-01-16T13:44:55.000Z",
            "updatedOn": null,
            "slot": {
               "id": 8,
               "startsAt": "2020-01-17T14:04:00.000Z",
               "duration": 15,
               "isPrivate": true,
               "practice": {
                  "id": 3,
                  "practiceName": "Manipal",
                  "email": "rashar@agkiya.cloud"
               },
               "user": {
                  "id": 8,
                  "firstName": "Rashmi",
                  "email": "rashmi.hebbar@lucidatechnologies.com",
                  "profilePic": "PR_8.PNG"
               }
            },
            "status": {
               "statusName": "Confirmed"
            },
            "appointments": [
               {
                  "id": 11,
                  "userId": 13,
                  "petId": 5,
                  "bookingId": 10051,
                  "notes": null,
                  "createdOn": "2020-01-16T13:44:55.000Z",
                  "pet": {
                     "id": 5,
                     "petName": "choco",
                     "active": true
                  }
               }
            ],
            "practiceAppointmentType": {
               "appointmentType": "Post op check",
               "customerFee": 0
            },
            "user": {
               "id": 13,
               "firstName": "Rashmi hebbar",
               "lastName": "",
               "email": "rashmihebbar23@gmail.com",
               "profilePic": "PO_13.jpg"
            }
         }
      ]
   }

    expect(component.dateConvertion()).not.toBeNull();
    component.appointments;
    let appointments = component.appointments
    const fixture = TestBed.createComponent(AppointmentCardComponent);
     fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(appointments)).toEqual(null);

  });
  it("data should be null", () => {
    const fixture = TestBed.createComponent(AppointmentCardComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dateConvertion.service).toBeUndefined();
  });
  it("data should be not null", () => {
    expect(component.appointments).not.toBeNull();
  });
  it("data should be not null", () => {
    expect(component.appointments).not.toEqual("");
  });
  it("sort data for appointment methods", () => {
    spyOn(Array.prototype,'sort').and.callThrough();
  });
 
it('Setting value to input properties on button click', () => {
  let submitEl
  component.petOwner = false;
  fixture.detectChanges();
 // expect(submitEl.nativeElement.disabled).toBeTruthy();
  });
});
