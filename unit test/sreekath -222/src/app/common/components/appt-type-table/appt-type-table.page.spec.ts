import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ApptTypeTablePage } from './appt-type-table.page';
import { AppointmentType } from './appointmentType.model';

describe('ApptTypeTablePage', () => {
  let component: ApptTypeTablePage;
  let fixture: ComponentFixture<ApptTypeTablePage>;
  const apptModel = new AppointmentType();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApptTypeTablePage ],
      imports: [IonicModule.forRoot(),FormsModule,HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ApptTypeTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('expects deleteApptType should be intialized and it should be TRUE', () => {
    const apptType = {'appiontmentType' : 'private'}
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.deleteApptType(apptType)).not.toBeNull();
   });
   it('expects editApptType should be intialized and it should be TRUE', () => {
    const apptType = {'appiontmentType' : 'private'}
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editApptType(apptType)).not.toBeNull();
   });
   it('expects addNewApptType should be intialized and it should be TRUE', () => {
    const apptTypes = { 'appointmentType': 'public'}
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.addNewApptType(apptTypes)).toBeUndefined();
   });
   it('expects clickout should be intialized and it should be TRUE', () => {
    const event = [{value :100}]
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.clickout(event)).toBeUndefined();
   });
   it('expects isPrivate should be intialized and it should be TRUE', () => {
    const value = {value :'private'}
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isPrivate(value)).toBeUndefined();
   });
   it('expects ionViewWillEnter should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).not.toBeNull();
   });
   it('expects confirmationAlert should be intialized and it should be TRUE', () => {
    const apptTypes = { 'appointmentType': 'public'}
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.confirmationAlert(apptTypes)).not.toBeNull();
   });
   it('expects ngOnChanges should be intialized and it should be TRUE', () => {
    expect(component.ngOnChanges()).not.toBeNull();
   });
   it('expects confirmationAlert should be intialized and it should be TRUE', () => {
    const apptTypes = [{'appointmentType': 'public'},{'appointmentType': 'private'}]
    const fixture = TestBed.createComponent(ApptTypeTablePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.createApptType(apptTypes,apptModel)).not.toBeNull();
    expect(app.createApptType(apptModel)).toBeUndefined();
   });
});
