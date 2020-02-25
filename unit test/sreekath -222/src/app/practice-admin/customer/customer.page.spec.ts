import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerPage } from './customer.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from "@angular/core"; 
import { ViewCustomerPage } from '../view-customer/view-customer.page';
import { InviteUserPage } from '../invite-user/invite-user.page';
import { ListbarPage } from '../../common/components/listbar/listbar.page';
import { Customer } from '../customer';
import { CommonService } from 'src/app/common/services/common.service';
import { PracticeAdminService } from '../practice-admin.service';
import { User } from '../../common/models/user';
import {IonicStorageModule} from '@ionic/storage';
import { TablePage } from '../../common/components/table/table.page';
import { CancelAppointmentPage } from '../../common/components/cancel-appointment/cancel-appointment.page';
import { LateJoinPage } from '../../common/components/late-join/late-join.page';

describe('customer page for PA', () => {
  let component: CustomerPage;
  let fixture: ComponentFixture<CustomerPage>;
  let pratice:PracticeAdminService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPage,LateJoinPage,ViewCustomerPage,InviteUserPage,ListbarPage,TablePage,CancelAppointmentPage ],
      imports: [HttpClientTestingModule,RouterTestingModule,FormsModule,IonicModule.forRoot(),IonicStorageModule.forRoot()],
      providers: [CommonService,PracticeAdminService]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerPage);
    component = fixture.componentInstance;
    pratice=TestBed.get(PracticeAdminService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit()
  });
  it('expects method should be intialized and it should be TRUE', () => {
    component.model = new User();
    let testresponse;
    const fixture = TestBed.createComponent(CustomerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getCustomers).toBeTruthy();
    component.model = testresponse;
    component.isCustomerData = true;
});
it('expects method should be intialized and it should be TRUE', () => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.viewCustomerInfo).toBeTruthy();

});
it('expects viewCustomerInfo method should be intialized and it should be pass', () => {
  let selectedCustomer:any
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.viewCustomerInfo(Customer)).toBeUndefined();
});
it("should render ngOnChanges", () => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  let  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnChanges').and.callFake(() => console.log('fake ngOnChanges'));
});
it('expects ngOnChanges method should be intialized and it should be pass', () => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnChanges()).not.toBeNull();
});
it('pass selected customer to Customer', () => {
  let selectedCustomer:any
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.viewCustomerInfo(selectedCustomer = Customer)).toBeUndefined();
});
it('expects addNewCustomer method should be intialized and it should be pass', () => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.addNewCustomer(Customer)).toBeUndefined();
});
it('expects sendInvite method should be intialized and it should be pass', () => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.sendInvite(Customer)).toBeUndefined();
});
it('sendInvite should be render', () => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.sendInvite).toBeTruthy();
});
it('expects method should be intialized and it should be TRUE', () => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.addNewCustomer).toBeTruthy();
});
it('should render image for ipad', async(() => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  const compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('div>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
}));
it('should have the other component "listbar"', async(() => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  //should be initialiszed initially
  const compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('app-llistbar')).toBeNull();
  fixture.detectChanges();
}));
it('should have the other component "invite-user"', async(() => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  //should be initialiszed initially
  const compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('app-invite-user')).toBeTruthy();
  fixture.detectChanges();
}));
it('should have the other component "view-customer"', async(() => {
  const fixture = TestBed.createComponent(CustomerPage);
  fixture.detectChanges();
  //should be initialiszed initially
  const compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('app-view-customer')).toBeNull();
  fixture.detectChanges();
}));
it('assigning for model',()=>
{
const mod = component.model;
mod.id=1;
mod.firstName = 'sameer';
mod.mobile = '9676022850';
mod.email = 'sameer@gmail.com';
mod.password = 'sameer123';
mod.profilePic = 'image.png';
mod.practiceId = 322;
mod.isActive =true;
mod.createdOn = new Date();
mod.lastAccessOn = new Date();
expect(mod.id).toBe(1);
expect(mod).not.toBeNull();
expect(mod.firstName).toBe('sameer');
expect(mod.mobile).toBe('9676022850');
expect(mod.mobile).not.toBeNull();
expect(mod.isActive).toBe(true); 
expect(mod.practiceId).toBe(322);
expect(mod.email).not.toBeNull();
component.getCustomers();
});



it('viewCustomerInfo',()=>
{
let data=[{'petname':'alex','petId':123}]
let comp=component.viewCustomerInfo(data);
expect(comp).not.toBeNull();
expect(component.isNew).toBe(false);
expect(component.isView).toBe(true);
expect(component.selectedCustomer).toBe(data);



});
it('pratice admin service',()=>
{
let comp=pratice.getCustomersByPractice(1).subscribe((res)=>
{
  expect(res).toBeNull();



})



});


it('customer',()=>
{

  let compo=component.flag;
  expect(compo).toBe('customer');
})
it(' addNewCustomer',()=>
{
  let compo=component.addNewCustomer('customer');
  expect(compo).not.toBeNull();

});


it('ngOnchanges',()=>
{
expect(component.ngOnChanges).not.toBeUndefined();
expect(component.ngOnInit).not.toBeUndefined();
});
});import { from } from 'rxjs';

