import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppointmentsListComponent } from './appointments-list.component';


import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import {
    HttpModule,
    XHRBackend,
    Response,
    ResponseOptions,
    RequestMethod
  } from '@angular/http';
import { By } from '@angular/platform-browser';

describe('AppointmentsListComponent', () => {
  let component: AppointmentsListComponent;
  let fixture: ComponentFixture<AppointmentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
      const res = component.data;
      if (res != undefined) {
        expect(res).not.toBeUndefined();
      }


  });

  it('menuItems should not be undefined', () => {
    const res = component.menuItems;
    if (res != undefined) {
      expect(res).not.toBeUndefined;
    }


});





  it('check the presentPopover', () => {
    const result = component.popoverActions('data', 'event');
    expect(result).not.toBe(null);
});

  it('popover action to br truthy', () => {
  let res=component.presentPopover('data','event');
  expect(res).not.toBeNull();
});


it('ngOnchanges',()=>
{
let result=component.ngOnChanges();
expect(result).not.toBeNull();
})


it('ngOnInit',()=>
{
let result=component.ngOnInit();
expect(result).not.toBeNull();
})



it('status list',()=>
{

let st=component.statusList;
expect(st).toEqual(['Awaiting confirmation', 'Confirmed', 'Cancelled', 'Completed']);



})

it('incoming data',()=>{

  let mydata=[{appointmentId: 10031,
  appointmentDate: "Jan 10, 2020",
  time: "10:30 AM",
  duration: "20 min",
  practicerName: "Lucida clinic ",
  practicerId: 2,
  userId: 3,
  paid: "£ 20",
  status: "Not Confirmed",
  vet: "ravinanda nayak bhai",
  petId: 1}
]
if(component.data!=undefined){
  expect(component.data).toEqual(mydata);
}else
{
expect(component.data).toBeUndefined();
}
});

it('menu Items',()=>
{
  if(component.menuItems!=undefined)
  {

  
  expect(component.menuItems).toBe(["Edit Booking", "Cancel Booking", "Re-Book", "Download-Invoice"]);
  }
})


it('status',()=>{

  component.statusList = ['Awaiting confirmation', 'Confirmed', 'Cancelled', 'Completed'];
  let data=[{
    "oppointmentType":'standard',
    "timing":"10:AM",
    "status":"active"
  }]
if(data!=undefined){
  data.sort((a, b) => {
    return component.statusList.indexOf(a.status) - component.statusList.indexOf(b.status);
  });
}
 





})

// it('check html elements',()=>
// {

//   let createPasteButton = fixture.debugElement.query(By.css(".table"));
//   // expect(createPasteButton).not.toBeNull();


//   expect(createPasteButton.nativeElement.textContent.trim()).not.toBeNull();
// })


// it('should render main title', () => {
//   // const fixture = TestBed.createComponent(BookingsPage);
//   fixture.detectChanges();
//   const compiled = fixture.debugElement.nativeElement;
//   expect(compiled.querySelector('.no-appts').textContent).toContain('No bookings present');
// });










});













