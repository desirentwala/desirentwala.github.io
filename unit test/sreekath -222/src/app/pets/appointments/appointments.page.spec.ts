import { forwardRef } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import * as _ from 'underscore';
import * as moment from 'moment';
import { AppointmentsPage } from './appointments.page';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule,  } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AlertController, ModalController } from '@ionic/angular';
import {
  HttpClientTestingModule,
  HttpTestingController,

} from '@angular/common/http/testing';
import { NotificationService } from '../../common/services/notification.service';
import { By } from '@angular/platform-browser';
import { CommonService } from '../../common/services/common.service';
import { MockPetService } from '../mock.pets.service';
import {DebugElement} from '@angular/core';
import { XHRBackend, HttpModule, Response, RequestMethod, ResponseOptions } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MockPracticeAdminService } from '../../practice-admin/mock.practice-admin.service';
import { MockMagicLinkService } from 'src/app/common/services/magic-link/mock.magic-link.service';
import { Appointment } from '../appointment.model';
import { MagicLinkService } from 'src/app/common/services/magic-link/magic-link.service';
import { PetService } from '../pets.service';
import { ChangeDetectorRef } from '@angular/core';
import { SchedulingService } from 'src/app/scheduling-management/service/scheduling.service';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
describe('Appointment Booking will render', () => {
  const model = new Appointment();
  let mockBackend: MockBackend;
  let component: AppointmentsPage;
  let fixture: ComponentFixture<AppointmentsPage>;
  let practiceservice: MockPracticeAdminService;
  let service: MockPetService;
  let service1: PetService;
  let magiclink: MockMagicLinkService;
  let apiUrl;
  let inputEl: DebugElement;
  const MAX_PET = 3;
  const practiceId = 5;
  const date = '2015-01-01';
  const appointmentslots: any = [];
  let appointments: any;
  let activePetId: number;
  const isPrivateSlot = false;
  let privateSlot: any;
  let isShow: boolean;
  let alertController: AlertController;
  let modalController: ModalController;
  let cdr: ChangeDetectorRef;
  let notificationService: NotificationService;
  let schedulingService: SchedulingService;
  let AdminService: PracticeAdminService;
  it('should render main title', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Book an appointment'
    );
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentsPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        HttpModule,
        FormsModule,
     IonicStorageModule.forRoot()
      ],
      providers: [MockPetService, PetService,StatusBar, PracticeAdminService, MagicLinkService, {provide: XHRBackend, useClass: MockBackend}, ModalController, AlertController, NotificationService, SchedulingService, MockMagicLinkService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppointmentsPage);
        component = TestBed.createComponent(AppointmentsPage).componentInstance;
      });
    service = TestBed.get(MockPetService);
    service1 = TestBed.get(PetService);
    schedulingService = TestBed.get(SchedulingService);
    practiceservice = TestBed.get(MockPracticeAdminService);
    mockBackend = TestBed.get(XHRBackend);
    fixture = TestBed.createComponent(AppointmentsPage);
    component = fixture.componentInstance;
    AdminService = TestBed.get(PracticeAdminService);
    fixture.detectChanges();
  }));

  beforeEach(async () => {
      component.ngOnInit();
     });

  // it("should create", () => {
  //   expect(component).toBeTruthy();
  // });
  it('should be created', () => {
    expect(service).toBeTruthy();
   });
  it('should be created', () => {
    expect(component.modalController).toBeTruthy();
    const modalSpy = jasmine.createSpyObj('Modal', ['present']);
    const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalCtrlSpy.create.and.callFake(function() {
        return modalSpy;
    });
   });
  it('should be created', () => {
    expect(component.alertController).toBeTruthy();
    const alertSpy = jasmine.createSpyObj('Modal', ['present']);
    const alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);
    alertCtrlSpy.create.and.callFake(function() {
        return alertSpy;
    });
   });
  it('should be created', () => {
    const cdr = jasmine.createSpyObj('cdr', ['create']);
    cdr.create.and.callFake(function() {
        return cdr;
    });
   });
  it('dropdown title to be', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector("ion-label").textContent).toContain(
    //   "Please choose your pet?"
    // );
  });
  it('petData should exist', () => {
    const petId  = 12;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPetList).toBeTruthy();
    expect(component.getPetList(petId)).not.toBeNull();
  });
  it('appointments Model should exhist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    component.model.petId = 9;
    component.activePetId = 3;
    component.isEditable = true;
    component.getPetAppointment();
  });
  it('basePath should exist for environment base url', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.basePath).toBeTruthy();
  });

  it('ionViewWillEnter should exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter).toBeTruthy();
  });
  it('ionViewWillEnter should exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).not.toBeNull();
    expect(app.cdr.detectChanges()).toBeUndefined();
  });
  it('ionViewWillEnter should exist for no data ', () => {
    let data: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter(data)).toBeUndefined();
  });

  it('model variables should be truthy', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.model).toBeTruthy();
  });
  it('appointmentslots array', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.appointmentslots).toBeTruthy();
  });
  it('appointment should exhist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.appointments).toBeUndefined();
  });

  it('should render this image only for desktop', async(() => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.desktop-logo>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  }));

  it('selected date should exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedAppointmentDate).toBeTruthy();
  });
  it('slot should be exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPracticeSlots).toBeTruthy();
  });
  it('slot should be execute', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPracticeSlots(practiceId, date).then(res => {
       this.getData = res.data;
       this.getData.practiceId = 5;
    }));
  });
  it('slot should be execute False', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPracticeSlots(practiceId, date).then(res => {
       this.getData = res.data;
       this.getData.practiceId = '';
    }));
  });
  it('selected slot to True', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedPet(pet).then(res => {
    this.pet = res.activePetId;
    }));
  });
  it('displayed slot Date', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onDisplaySlots(date).then(res => {
     this.date = res.date;
    }));
  });
  it('displayed slot Date not to be null', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onDisplaySlots(date)).not.toBeNull();
  });
  it('Booking Appointment should be data not be null', () => {
    const data = [{ id: '5',bookingdate: '20-01-2020',price: 4000,practiceName: 'appolo clinic'}];
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.bookAppointment(data)).not.toBeNull();
  });
  it('selected slot to True', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedAppointmentDate(date)).toBeUndefined();
  });
 
  it('selected slot to True', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedAppointmentDate(date)).not.toBeNull();
  });
  it('selected slot to True', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedAppointmentDate(date)).not.toBeNull();
  });
  it('selected date to be False', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedAppointmentDate(date)).toBeFalsy();
  });
  it('selected date to be False', () => {
    let pet: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedAppointmentDate(date)).toBeFalsy();
  });
  it('showmore should be exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showMorePets).toBeTruthy();
  });
  it('showLessPets should be exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showLessPets).toBeTruthy();
  });
  it('showmore should be exist passing mock pets', () => {
    let MAX_PET: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showMorePets(MAX_PET)).toBeUndefined();
    expect(component.MAX_PET).toBe(3);
  });
  it('showmore should be exist passing mock pets', () => {
   const petData = [{ petID: '003'}];
   const fixture = TestBed.createComponent(AppointmentsPage);
   fixture.detectChanges();
   const app = fixture.debugElement.componentInstance;
   expect(app.showMorePets(petData)).toBeUndefined();
  });

  it('showless should be exist passing mock pets', () => {
    let MAX_PET: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showLessPets(MAX_PET)).toBeUndefined();
  });
  it('showless should be exist showMore mock pets', () => {
    let MAX_PET: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showMorePets(MAX_PET !== 0)).toBeUndefined();
  });
  it('showless should be exist passing mock pets', () => {
    const petData= {value:''}
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showLessPets(petData)).toBeUndefined();
  });
  it('showless should be exist passing mock pets', () => {
    const petData= {value:''}
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showMorePets(petData)).toBeUndefined();
  });

  it('showmore should be exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getSlotsForPet).toBeTruthy();
  });
  it('showmore should be exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.notificationService.notification().then(res => {
      res = 'Failed to retrieve slot details, please use the link from mail again.';
    }));
  });
  it('showmore should be exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
      slotInfo => {
          component.privateSlot = slotInfo.data;
          component.isShow = true;
          component.getPetListforPractise(val.practiceId);
          component.isEditable = true;
          component.isPrivateSlot = true;
      };
    }));
  });
  it('showmore should be exist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPetListforPractise().then((sampledata) => {
     return sampledata;
    }));
  });
  it('getAppointmentTypes services ',()=>
  {
   const test = '';
   const spy = spyOn(service1, 'getPetList').and.callFake(() => {
   return Observable.from([test]);
  })
  fixture.componentInstance.getPetList()
  expect(spy).toHaveBeenCalled();
  });

  it('showmore should be exist', () => {
    let slot: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getSlotsForPet(slot)).toBeUndefined();
  });

  it('petData fetching from MockPetService', () => {
    // let data = service.getPetList().userId = 5;
      const petList = service.getPetList();
    // Arrange
      mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toBe(apiUrl);

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: petList
          })
        )
      );
    });
  });
  it('petData should be create in an array based on condition', () => {
    expect(fixture.debugElement.query(By.css('.spectest'))).toBeNull();
  });
  it('check Appiontment Date Validation field', () => {
    inputEl = fixture.debugElement.query(By.css('input[date=slotDate]'));
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsPage);
    const de = fixture.debugElement;
  });
  it('should test the table ', () => {
    const de = fixture.debugElement;
    const tableActive = practiceservice.getPracticeSlots();
    expect(tableActive).not.toBeNull();
    fixture.detectChanges();
    const rowDebugElements = de.queryAll(By.css('tbody tr th'));
    expect(rowDebugElements.length).toBe(0);
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr td');
    expect(rowHtmlElements.length).toBe(0);
  });
  it('magiclink url should exhist', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.processMagicLink).toBeTruthy();
  });
  it('magiclink url should exhist', () => {
    let MagicLink: MagicLinkService;
     const fixture = TestBed.createComponent(AppointmentsPage);
     fixture.detectChanges();
     const app = fixture.debugElement.componentInstance;
     expect(component.processMagicLink(MagicLink)).not.toBeNull();
  });
  it('Swap the two pets', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.swap).toBeTruthy();
  });
  it('service call method for exhisting PetAppointment', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPetAppointment).toBeTruthy();
  });
  it('getPetAppointment call method for Null case', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPetAppointment()).not.toBeNull();
    component.getPetList(5);
  });

  it('choosing pet method will CALL ', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedPet).toBeTruthy();
  });
  
  it('choosing ionViewDidEnter method will CALL ', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidEnter).not.toBeNull();
  });
  it('choosing selectedPet method will CALL ', () => {
    const pet = {id:123};
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.selectedPet(pet)).not.toBeNull();
    app.activePetId = 5;
  });
  it('table slot displaying as per user selecting pet', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onDisplaySlots).toBeTruthy();
  });
  it('booking appointment by clicking button ', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.bookAppointment).toBeTruthy();
  });
  it('booking appointment by private slot', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.bookPrivateSlot).toBeTruthy();
  });
  it('booking appointment by private slot', () => {
    let slot: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.bookPrivateSlot(slot)).toBeUndefined();
  });

  it('conformation modal for booking Appointment modal', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.presentModal).toBeTruthy();
  });
  it('slotSelection method should call', () => {
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.slotSelection).toBeTruthy();
  });
  it('slotSelection method should call', () => {
    const slotId = 3;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.slotSelection(slotId)).not.toBeNull();
  });
  it('conformation modal for booking Appointment modal', () => {
    let data: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.presentModal(data).then(data => {
     this.header = 'On Appointment Day',
     this.subHeader = 'To ensure that your consultation runs smoothly, please check the following:';
    }));
  });
  it('conformation modal for wrong data modal', () => {
    let data: any;
    const fixture = TestBed.createComponent(AppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.presentModal(data).then(data => {
     this.header = '',
     this.subHeader = '';
    })).not.toBeNull();
  });


  it('ion will enter', () => {

      setTimeout(() => {
        component.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
          expect(val).toBeNull();
          if (val !== null) {
            AdminService.getPrivateSlotInfo(val.slotId).subscribe(
              slotInfo => {
                expect(slotInfo).not.toBeNull();
                if (slotInfo) {
                  component.privateSlot = slotInfo.data;
                  component.privateSlot.Appon = moment(slotInfo.data.startsAt.toString()).format('YYYY-MM-DD'),
                    component.privateSlot.time = moment(slotInfo.data.startsAt.toString()).format('HH:mm'),
                    component.isShow = true;
                  component.getPetListforPractise(val.practiceId);
                  component.isEditable = true;
                  component.isPrivateSlot = true;
                  component.cdr.detectChanges();
                }
              }, err => {
                notificationService.notification('Failed to retrieve slot details, please use the link from mail again.', 'failed');
              });
          }
        });
      }, 500);






  });

  it('assigning for model', () => {
const mod = component.model;
mod.id = 1;
mod.userId = 121212;
mod.email = 'sameer@gmail.com';
mod.petName = 'alex';
mod.petId = 1;
mod.bookingId = 12;
mod.speciesId = 12;
mod.slotId = 12;
mod.status = 'pet';
mod.firstName = 'sameer';
mod.practiceName = 'vet';
mod.isPrivate = true;
expect(mod.id).toBe(1);
expect(mod).not.toBeNull();
expect(mod.userId).toBe(121212);
  //   appointments: Array<any> = [];
  //   slot: { id: number, isPrivate: boolean, vet: string, duration: string, startsAt: string,
  //     practiceAppointmentTypeId: number, appointmentType: string, originalDateTime: any };
  //   oldSlotId?: number;
  // practiceName: any;

  });


  it('date validation', () => {
  const  date = { target:{value: '12-02-2020'}}
  const  date1 = '';
  expect(component.dateValidation(date)).not.toBeNull();
  expect(component.dateValidation(date1)).not.toBeNull();
  });
it('ionviewdidenter',()=>
{
    expect(component.ionViewDidEnter()).toBeUndefined();
    if (cordova.platformId === 'ios') {
      component.statusBar.styleLightContent();
    } else {
      component.statusBar.styleDefault();
    }
});


it('storage',()=>
{
  if (component.magicLink === 'yes') {
    component.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
      if (val) {
      expect(val).toBeNull();
      }
    });
  }

})


it(' initPayment',()=>
{
expect(component.initPayment()).toBeUndefined();


})


});
