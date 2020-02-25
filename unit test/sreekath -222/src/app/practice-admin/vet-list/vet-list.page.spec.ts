import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VetListPage } from './vet-list.page';
import { RouterTestingModule  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { AddnewVetPage } from '../addnew-vet/addnew-vet.page';
import { ListbarPage } from '../../common/components/listbar/listbar.page';
import { CalendarPage } from '../../scheduling-management/calendar/calendar.page';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import * as moment from 'moment';
import { SlotPage } from '../../scheduling-management/slot/slot.page';
import { Storage } from '@ionic/storage';
import { MockStorage } from '../vet-list/mockStorage';
describe('VetList Page will render', () => {
  let component: VetListPage;
  let fixture: ComponentFixture<VetListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetListPage,AddnewVetPage, ListbarPage,CalendarPage,SlotPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule,FormsModule],
      providers: [{provide: Storage, useClass: MockStorage}]
    }).compileComponents();

    fixture = TestBed.createComponent(VetListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(VetListPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });

  it('should initialize the ngOninIt', async () => {
    const fixture = TestBed.createComponent(VetListPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
  });
  it('should initialize the ngOnChanges', async () => {
    const fixture = TestBed.createComponent(VetListPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges()).not.toBeNull();
  });
  it('should initialize the ngOnChanges', async () => {
    const fixture = TestBed.createComponent(VetListPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges()).not.toBeNull();
  });
  it("should render destroy", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnDestroy').and.callFake(() => console.log('fake destroy'));
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.destroy).toBeTruthy();
  });
  it("expects method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.destroy()).not.toBeNull();
});
it("should render init()", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'init').and.callFake(() => console.log('fake init'));
  });
  it("init method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.init).toBeTruthy();
  });
  it("init method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.init()).not.toBeNull();
});
it("getVetListByPractice method should be intialized and it should be TRUE", () => {
  const fixture = TestBed.createComponent(VetListPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.getVetListByPractice).toBeTruthy();
});
it("getVetListByPractice method should be intialise and not null", () => {
  const fixture = TestBed.createComponent(VetListPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.getVetListByPractice()).not.toBeNull();
});
it("selectedCustomer method should be intialized and it should be TRUE", () => {
  const fixture = TestBed.createComponent(VetListPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.selectedCustomer).toBeTruthy();
});
it("selectedCustomer method should be intialise and not null", () => {
  const fixture = TestBed.createComponent(VetListPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.selectedCustomer()).not.toBeNull();
  expect(component.isNew).toBe(false);
  expect(component.isCalender).toBe(true);
});
it("callByVetAndPractice method should be intialized and it should be TRUE", () => {
  const fixture = TestBed.createComponent(VetListPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.callByVetAndPractice).toBeTruthy();
});
it("callByVetAndPractice method should be intialise and not null", () => {
  const fixture = TestBed.createComponent(VetListPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.callByVetAndPractice()).not.toBeNull();
});
   it("addNewCustomer method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.addNewCustomer).toBeTruthy();
    expect(app.addNewCustomer()).not.toBeNull();
    component.isNew = true;
    component.isCalender = false;
  });
   it("callByPractice method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.callByPractice).toBeTruthy();
  });
  it("onAddNewVet method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onAddNewVet).toBeTruthy();
    expect(app.onAddNewVet()).not.toBeNull();
  });
  it("slotsIn method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.slotsIn).toBeTruthy();
    expect(app.slotsIn()).not.toBeNull();
  });
  it("callByPractice method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(VetListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.callByPractice()).not.toBeNull();
     });
     it("callByPractice method should be intialise and not null", () => {
      const fixture = TestBed.createComponent(VetListPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.callByPractice()).toBeUndefined();
       });
});
