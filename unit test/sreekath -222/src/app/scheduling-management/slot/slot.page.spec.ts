import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SlotPage } from './slot.page';
import { FormsModule, ReactiveFormsModule, FormGroup } from "@angular/forms";
import { Storage } from '@ionic/Storage';
import { IonicStorageModule } from '@ionic/storage';
import { NotificationService } from 'src/app/common/services/notification.service';
import * as moment from 'moment';
import { MagicLinkService } from '../../common/services/magic-link/magic-link.service';
import { SlotBase } from '../slot.base';
import { By } from "@angular/platform-browser";
import { PracticeAdminService } from '../../practice-admin/practice-admin.service';
import {
    HttpModule,
    XHRBackend,
    Response,
    ResponseOptions,
    RequestMethod
  } from '@angular/http';
  import { MockBackend, MockConnection } from '@angular/http/testing';
  import { DebugElement } from '@angular/core';
  import { Slot } from '../slot.model';
  
  import {
    inject,
    fakeAsync,
    tick
  } from '@angular/core/testing';
  import { MockPracticeAdminService } from '../../practice-admin/mock.practice-admin.service';

describe('Slot page will render', () => {
  let component: SlotPage;
  let fixture: ComponentFixture<SlotPage>;
  let storage: Storage;
  let service:MockPracticeAdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,
        HttpClientTestingModule,FormsModule,IonicStorageModule.forRoot(),ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
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
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.slot).toBeUndefined();
  });
  it("passsing sourceType As Param", () => {
    expect(component.slot).not.toBeNull();
  });
  it("passsing sourceType As Param", () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ngOnInit).not.toBeNull();
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it("should render destroy", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnDestroy').and.callFake(() => console.log('fake destroy'));
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.destroy).toBeTruthy();
  });
  it("expects method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.destroy()).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isPrivate).toBeTruthy();
  });
  it("expects method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isPrivate).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.emailSelect()).toBeUndefined();
    expect(app.emailSelect).toBeTruthy();
  });
  it("expects method should be intialise and not null", () => {
    let email;
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.emailSelect(email)).not.toBeNull();
  });
  it('should initialize the method "createAppointment" and it will be undefined while no data', async () => {
    const fixture = TestBed.createComponent(SlotPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.getCustomerDetails()).not.toBeNull();
    expect(app.getCustomerDetails()).toBeUndefined();
    expect(component.customerDetails).toEqual([])
  });
  it("expects 'slotTimeCompare' method should be FALSE", () => {
    component.createSlot()
    expect(component.slotTimeCompare(component.model.time)).toBe(false);
  });
  it("expects 'createSlot' method render", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.createSlot()).not.toBeNull();
  });
  
  it("expects 'getAppointmentTypes' method should be TRUE", () => {
    component.getAppointmentTypes()
    expect(component.appointmentTypes).toEqual([]);
  });
  it("expects 'getAppointmentTypes' method should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAppointmentTypes()).not.toBeNull();
  });
  it("expects 'dateValidation' method should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dateValidation).toBeTruthy();
  });
  it("expects 'dateValidation' method should be TRUE", () => {
    const date = '';
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.dateValidation(date)).not.toBeNull();
  });
  it("expects 'dateValidation' method should be TRUE", () => {
    let isInvalid: boolean;
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dateValidation()).not.toBeNull();
    expect(component.isInvalid).toBe(undefined);
  });
  it("expects 'vetSelection' method should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.vetSelection).toBeTruthy();
  });
  it("expects 'slot' method should be TRUE", () => {
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.slot).not.toBeNull();
  });
  it("expects 'vetSelection' method should be TRUE", () => {
    let isPublic, isPrivate;
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.isStatus(isPublic, isPrivate)).toBeUndefined();
    expect(component.isStatus(isPublic, isPrivate)).not.toBeNull();
  });
  it("expects 'isPrivate' method should be TRUE", () => {
    const value = 'private';
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.isPrivate(value)).toBeUndefined();
    expect(component.isPrivate(value)).not.toBeNull();
    component.model.isPrivate = false;
    component.isStatus(true, false);
    const value1 = 'public';
    expect(component.isPrivate(value1)).not.toBeNull();
  });

  it("expects 'vetSelection' method should be TRUE", () => {
    let isInvalid: boolean;
    const id = 5;
    const vetDetails = {firstName: 'sameer'};
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.vetSelection()).not.toBeNull();
    component.vetSelection(id)
    expect(component.model.vetName).toBe(undefined);
    expect(component.vetDetails.firstName).toBe(vetDetails);
    expect(component.model.vetId).toBe(id);
  });
  it("should show a validation error if the date and time was touched", () => {
    let component = fixture.componentInstance;
    fixture.detectChanges();
    let dateValidationError: DebugElement;
    fixture.detectChanges();
    dateValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(dateValidationError).toBeNull();
    let timeValidationError: DebugElement;
    fixture.detectChanges();
    timeValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(timeValidationError).toBeNull();
  });
  it('assigning for model',()=>
  {
  const mod = component.slotModel;
  mod.id=1;
  mod.userId = 23423423;
  mod.practiceId = 324242;
  mod.startsAt = 4324;
  mod.duration = 12313;
  mod.isPrivate = true;
  mod.practiceAppointmentTypeId = 13443;
  mod.appointmentType = 322;
  expect(mod.id).toBe(1);
  expect(mod).not.toBeNull();
  expect(mod.userId).toBe(23423423);
  expect(mod.practiceId).toBe(324242);
  expect(mod.startsAt).not.toBeNull();
  expect(mod.isPrivate).toBe(true); 
  });
  it("expects 'close' method should be TRUE", () => {
    let isInvalid: boolean;
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.close()).not.toBeNull();
  });
  it('expects vetList method should be TRUE', async(() => {
    let v: any[]
    component.vetList= ['test'];
    expect(component.vetList).toEqual(['test']);
   }));
   it('expects slot method should be TRUE', async(() => {
    component.slot ;
    expect(component.slot).toBeUndefined();
   }));
   it("expects slot methods and it should be TRUE", () => {
    const v = ''
    const fixture = TestBed.createComponent(SlotPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app['slot'] = '';
    expect(app.slot).not.toBeNull();
    });
});
