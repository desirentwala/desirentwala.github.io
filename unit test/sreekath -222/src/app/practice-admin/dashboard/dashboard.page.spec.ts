import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Practice Admin Dashboard will render', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('expects method should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.quickNavigation).toBeTruthy();
});
it('method should be render "quickNavigation"', () => {
  let path;
  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.quickNavigation()).not.toBeNull();
  expect(app.quickNavigation(path)).not.toBeNull();
  });
  it('array should be render "notifications"', () => {
     expect(component.notifications).toEqual([
        {event: '5:30pm auto assigned to Dr.Mery', schedule: true},
        {event: '5:30pm auto assigned to Dr.Mery'},
        {event: '5:30pm auto assigned to Dr.Mery'},
        {event: '5:30pm auto assigned to Dr.Mery'},
        {event: '5:30pm auto assigned to Dr.Mery', cancellation: true},
        {event: '5:30pm auto assigned to Dr.Mery', schedule: true},]);
 });
 it('array should be render "notifications"', () => {
    expect(component.links).toEqual([
        {link: 'Schedule an Appointment', path: 'slotscheduling'},
        {link: 'Add a New Customer', path: 'customer'},
        {link: 'Add a New Vet', path: 'vet'},]);
});
it('array should be render "items"', () => {
    expect(component.items).toEqual([
        {action: 'Refunds', count: '10'},
        {action: 'Appt. updates', count: '8'},
        {action: 'Cancellations', count: '6'},]);
});
it('array should be render "vetAppointment"', () => {
    expect(component.vetAppointment).toEqual([
        {vet: 'Dr.Annual', noAppointment: '10'},
        {vet: 'Dr.Mery', noAppointment: '6'},
        {vet: 'Dr.Scort', noAppointment: '4'},
        {vet: 'Dr.Swag', noAppointment: '2'},
    ]);
  
});
it('array should be render "title"', () => {
    expect(component.title).toBeUndefined();
});
});

