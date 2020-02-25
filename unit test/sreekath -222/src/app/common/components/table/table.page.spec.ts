import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TablePage } from './table.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CancelAppointmentPage } from '../cancel-appointment/cancel-appointment.page';
import { LateJoinPage } from '../late-join/late-join.page';
import { TableService } from '../../services/table.actions.service';
import { PopoverController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import * as moment from 'moment';
import { AppointmentService } from 'src/app/pets/appointment.service';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

describe('TablePage should render', () => {
  let component: TablePage;
  let fixture: ComponentFixture<TablePage>;
  let bookingdata;
  let PopoverController:PopoverController
  it("should render bookings title", () => {
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h3")).toBeNull();
  });
  it("should render tr data with inside condition", () => {
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("tr")).toBeNull();
  });
  it("should render tr data with inside condition", () => {
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("td")).toBeNull();
  });

 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablePage,CancelAppointmentPage,LateJoinPage ],
      imports: [HttpClientTestingModule,RouterTestingModule,FormsModule,IonicModule.forRoot()],
      providers: [TableService,File,FileOpener],
    }).compileComponents();
     let service = TestBed.get(TableService);
    fixture = TestBed.createComponent(TablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data mismatch for presentPopover method', () => {
    const  data = [{'test' : 'sampledata1'}];
    const ev =  Event;
   expect(component.presentPopover(data,ev)).not.toBeNull();
  });
  it('start vedio method should called', () => {
    let bookingData :any;
    let appointmentId:any
    expect(component.StartVideo(bookingData)).toBeUndefined();
  });
  it('start vedio method should called', () => {
    let bookingData :any;
    let appointmentId:any
    expect(component.StartVideo(bookingData)).not.toBeNull();
  });
  it('bookingdata array should not be null', () => {
    expect(component.bookingdata).not.toBeNull();
  });
  it('bookingdata array should not be null', () => {
    bookingdata = [
      {
        "name": 'alexa',
        "date" : '18-01-2020'
      }
    ]
    expect(component.StartVideo(bookingdata)).not.toBeNull();
  });
  it('header array should not be null', () => {
    expect(component.header).not.toBeNull();
  });
  it('menuItems array should not be null', () => {
    expect(component.menuItems).not.toBeNull();
  });
  it('flag array should not be null', () => {
    expect(component.flag).not.toBeNull();
  });
  it('popoveractions method should called', () => {
    const dataFromPopover  = Boolean;
    const menuItem = 'Cancel Booking'
    expect(component. popoverActions(dataFromPopover, menuItem)).toBeUndefined();
  });
  it('popoveractions method should called', () => {
    const dataFromPopover  =Boolean ;
    const menuItem1 = 'Joining Late'
    expect(component. popoverActions(dataFromPopover, menuItem1)).toBeUndefined();
  });
  it('popoveractions method should called', () => {
    const dataFromPopover  = Boolean;
    const menuItem1 = 'Download-Invoice'
    expect(component. popoverActions(dataFromPopover, menuItem1)).toBeUndefined();
    const menuItem2 = 'Confirm Appt.'
    expect(component. popoverActions(dataFromPopover, menuItem2)).toBeUndefined();
    const TestObj = {
      bookingId: 12,
      slotId: 12,
      startsAt: '12-01-2020',
      email: 'shaik.sameer@lucidatechnologies.com',
      vetName: 'sameer',
      appointmentOn: '12-03-2020',
      practiceName: 'sameer',
      firstName: 'shaik',
      petName: 'dog',
      practiceEmail: 'shaiksameer@lucidatechnologies.com',
      vetEmail: 'shaiksameer@lucidatechnologies.com',
    };
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
  //  component.popoverActions(dataFromPopover,menuItem2);
    comp['confirmApptObj'] = TestObj;
   // expect(comp.popoverActions(dataFromPopover,menuItem2)).toBeUndefined();
  });

  it('should render initiateVediosession', () => {
    expect(component.initiateVideoSession).toBeTruthy();
  });
  it('should render initiateVediosession failed case', () => {
     const data = component.bookingdata;
    expect(component.initiateVideoSession()).toBeUndefined();
    expect(component.initiateVideoSession()).not.toBeNull();
    expect(component.initiateVideoSession()).toBe(data);
  });
  it('should render presentPopover failed case', () => {
    let res;
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.presentPopover().then(res => { 
      this.res 
    })).not.toBeNull();
  });
  it('should render checkRole failed case', () => {
    const ev = event;
    const data = {completeData:{slot : 11}}
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.checkRole(data,ev)).not.toBeNull();
  });
  it('should render customerFlag', () => {
    expect(component.customerFlag).toBeTruthy();
  });
  it('should render customerFlag', () => {
    expect(component.customerFlag()).toBeUndefined();
  });
  it('should render customerFlag', () => {
    expect(component.customerFlag()).not.toBeNull();
  });
  it('should render presentPopover', () => {
    expect(component.presentPopover).toBeTruthy();
  });
  it('should render presentPopover', () => {
    let data,el;
    expect(component.presentPopover(data,el)).not.toBeNull();
  });
 
  it('should render popoverActions', () => {
    expect(component.popoverActions).toBeTruthy();
  });
  it('should render StartVideo', () => {
    expect(component.StartVideo).toBeTruthy();
  });
  it('should render checkRole', () => {
    expect(component.checkRole).toBeTruthy();
  });
  it('should render ngOnInit', () => {
    expect(component.ngOnInit).toBeTruthy();
  });
  it('should render ngOnInit', () => {
    expect(component.ngOnInit()).not.toBeNull();
  });
  it('should render ngOnChanges', () => {
    expect(component.ngOnChanges()).not.toBeNull();
  });
  it('should render ngOnChanges', () => {
    bookingdata = [{
     'name':'alexa',
     'bookingdate': '20-01-2020'
    }]
    expect(component.ngOnChanges()).toBeUndefined(bookingdata);
  });
  it('should call ngOnChanges', ()=> {
    const TablePage = fixture.componentInstance;
    TablePage.bookingdata = [];
    const component = TablePage.bookingdata;
    fixture.detectChanges();
    expect(component.ngOnChanges).toBeUndefined();
})

  it('should have the other component cancel appoinment', async(() => {
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    //should be initialiszed initially
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-cancel-appointment')).toBeTruthy();
    fixture.detectChanges();
  }));
 
  it('should have the other component cancel latejoin', async(() => {
    const fixture = TestBed.createComponent(TablePage);
    fixture.detectChanges();
    //should be initialiszed initially
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-late-join')).toBeTruthy();
    fixture.detectChanges();
  }));
  it('should test the table with data null ', () => {
    const de = fixture.debugElement;
    let bookingdata    
    let tableActive : any
    expect(tableActive).not.toBeNull();
    fixture.detectChanges(); 
    const rowDebugElements = de.queryAll(By.css('tbody tr th'));
    expect(rowDebugElements.length).toBe(0);
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr td');
    expect(rowHtmlElements.length).toBe(0);
  });
});
