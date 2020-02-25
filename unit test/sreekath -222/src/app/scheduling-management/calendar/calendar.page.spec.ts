import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarPage } from './calendar.page';
import { SlotBase } from '../slot.base';
import { CalendarEvent } from 'angular-calendar';
import { SlotPage } from '../slot/slot.page';
import {
    HttpClientTestingModule,
    HttpTestingController
  } from "@angular/common/http/testing";
  import { RouterTestingModule } from "@angular/router/testing";
  import { CommonService } from 'src/app/common/services/common.service';
  import { NotificationService } from '../../common/services/notification.service';

describe('CalendarPage', () => {
  let component: CalendarPage;
  let fixture: ComponentFixture<CalendarPage>;
  let SlotBase: SlotBase;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule],
      providers: [SlotPage,NotificationService,CommonService]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(CalendarPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it('should initialize the method "calendarData"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.calendarData).toBeTruthy();
  });
  it('should initialize the method "eventSlotData"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.eventSlotData).not.toBeNull();
  });
  it('should initialize the method "eventSlotData"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.eventSlotData(event)).not.toBeNull();
  });
  it('should initialize the method "handleEvent"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.handleEvent(event)).not.toBeNull();
  });
  it('should initialize the method "ngOnChanges"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges(event)).not.toBeNull();
  });
  it('should initialize the method "calendarEventChange"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.calendarEventChange(event)).not.toBeNull();
  });
  it('should initialize the method "handleHoursEvent"', async () => {
    const val=0;
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.handleHoursEvent(event,val)).not.toBeNull();
    app.notifyService.notification(`Confirmed slots can't be modified !`, 'danger');
  });
  it('should initialize the method "createAppointment" and it will be undefined while no data', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.createAppointment()).not.toBeNull();
    expect(app.createAppointment()).toBeUndefined();
  });
  it('should initialize the method "calendarData"', async () => {
    const vet = 'dog';
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.calendarData).not.toBeNull();
  });
  it('should initialize the method "vetList"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(component.vetList).not.toBeNull();
  });
  it('should initialize the method "view"', async () => {
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(component.view).not.toBeNull();
  });
  it('should initialize the method "calendarData"', async () => {
      const slot = [{ 'slotDate': '12-02-2020' }]
    const fixture = TestBed.createComponent(CalendarPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.sendSlot(slot)).not.toBeNull();
  });

});
