import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteUserPage } from './invite-user.page';
import { RouterTestingModule,  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import {DebugElement} from "@angular/core"; 
import { IonicStorageModule } from '@ionic/storage';
describe('InviteUserPage', () => {
  let component: InviteUserPage;
  let fixture: ComponentFixture<InviteUserPage>;
  let de:DebugElement;
  it('should render h3 tag title', () => {
    const fixture = TestBed.createComponent(InviteUserPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Invite customer');
  });
  it('should render h3 tag title', () => {
    const fixture = TestBed.createComponent(InviteUserPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('label').textContent).toContain('Pet owner email address');
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteUserPage ],
      imports: [RouterTestingModule,HttpClientTestingModule,FormsModule,IonicModule.forRoot(),IonicStorageModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('expects method should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(InviteUserPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.inviteCustomer).toBeTruthy();
});
it('expects "ngOnInit" should be render', () => {
  const fixture = TestBed.createComponent(InviteUserPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnInit).toBeTruthy();
});
it('inviteCustomer should be intialized and pass data as param', () => {
  let data;
 
  const fixture = TestBed.createComponent(InviteUserPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.inviteCustomer(data)).not.toBeNull();
  expect(app.inviteCustomer(data)).toBeUndefined();
 // const id = app.commonService.getStorage.id =5
 // expect(component.inviteCustomer()).toBe(id)
});

it("should show a validation error if the form was touched", () => {
  let component = fixture.componentInstance;
  fixture.detectChanges();
  let eamilValidationError: DebugElement;
  fixture.detectChanges();
  eamilValidationError = fixture.debugElement.query(By.css(".text-danger"));
  expect(eamilValidationError).toBeNull();
});
});
