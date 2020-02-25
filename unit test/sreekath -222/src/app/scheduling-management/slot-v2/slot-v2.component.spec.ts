import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlotV2Component } from './slot-v2.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { MockStorage } from '../slot-v2/mockStorage';
import { Slot } from '../slot.model';
import { SlotBase } from '../slot.base';

describe('SlotV2Component will render', () => {
  let component: SlotV2Component;
  var slotModel: Slot = new Slot();
  let fixture: ComponentFixture<SlotV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotV2Component ],
      imports: [RouterTestingModule,IonicModule.forRoot(),HttpClientTestingModule,FormsModule],
      providers: [{provide: Storage, useClass: MockStorage}]
    }).compileComponents();

    fixture = TestBed.createComponent(SlotV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("getCustomerDetails method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
   // comp['vetData'] = vetDetailsObj;
    expect(comp.getCustomerDetails()).toBeUndefined();
  });
  it("StartDateValidation method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.StartDateValidation(Date)).toBeUndefined();
  });
  it("endDateValidation method should render", () => {
    const Date = '12-02-2020';
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.endDateValidation(Date)).toBeUndefined();
  });
  it("close method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.close()).toBeUndefined();
  });
  it("vetSelection method should render", () => {
    const id =3;
    const vetDetails = {
      'id':{
        'firstName':'sameer'
      }
    }
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var comp = fixture.componentInstance;
    comp['vetSelection(id)'] = '';
    expect(comp.vetSelection(id)).toBeUndefined();
    expect(comp.vetSelection(vetDetails)).not.toBeNull();
  });
  it("close method should render", () => {
    const value = 'private';
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.isPrivate(value)).toBeUndefined();
    expect(comp.isPrivate(value)).not.toBeNull();
    const value1 = 'public'
    expect(comp.isPrivate(value1)).not.toBeNull();
    expect(comp.isPrivate(value1)).toBeUndefined();
  });
  it("emailSelect method should render", () => {
    const eamil = 'shaiksameer@lucidatechnologies.com';
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.emailSelect(eamil)).toBeUndefined();
  });
  it("getAppointmentTypes method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.getAppointmentTypes()).toBeUndefined();
  });
  it("createSlot method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.createSlot()).toBeUndefined();
  });
  it("slot method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.slot()).toBeUndefined();
    expect(comp.slot()).not.toBeNull();
  });
  it("slot method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    const v = '';
    var comp = fixture.componentInstance;
     comp['slot']= [];
    expect(comp.slot).toBeUndefined();
    expect(comp.slot).not.toBeNull();
  });
  it("vetList method should render", () => {
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['vetList'] = [];
    expect(comp.vetList).not.toBeNull();
  });
  it("close method should render", () => {
    const selectedDay = '06-02-2020';
    const index = 3;
    const fixture = TestBed.createComponent(SlotV2Component);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.onSelectDay(selectedDay,index)).toBeUndefined();
  });
});
