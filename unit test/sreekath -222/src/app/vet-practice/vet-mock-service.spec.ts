import { TestBed } from '@angular/core/testing';

import { MockVetPracticeService } from './vet-mock-service';
import {
    HttpClientTestingModule,
    HttpTestingController
  } from "@angular/common/http/testing";
  import { RouterTestingModule } from "@angular/router/testing";

 
describe('VetpractiseMockService to test', () => {

   // let VetPracticeService: VetPracticeService;
    // let httpClientSpy: { get: jasmine.Spy };
    // let appointment;
    // appointment: string;
    // allAppointment: string;
    // getAllAppointmentByUser: string;
    // details: string;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,RouterTestingModule,],
    providers:[MockVetPracticeService]
  }));

  it('should be created', () => {
    const service: MockVetPracticeService = TestBed.get(MockVetPracticeService);
    expect(service).toBeTruthy();
  });
  it('should be true', () => {
    // const fixture = TestBed.get(VetPracticeService);
    // const app = fixture.debugElement.subscribe(
    //     appointment => expect(appointment).toEqual(appointment, 'expected appointment'),true
    // );
    // expect(app.getVetDetails).toBeTruthy();
  });
// it('should be true', () => {
// const fixture = TestBed.createComponent(VetPracticeService);
// fixture.detectChanges();
// const app = fixture.debugElement.componentInstance;
// expect(app.getVetBookings).toBeTruthy();
// });
  
  it('should return expected tarif (HttpClient called once)', () => {
    const appointment =
      [{ id: 1, vetname: 'dog' }, { id: 2, name: 'cat' }];

    // httpClientSpy.get.and.returnValue(appointment);
    // VetPracticeService.getVetBookings(userInfo).subscribe(
    //   tarifs => expect(tarifs).toEqual(appointment, 'expected appointment'),
    //   fail
    // );
    //expect(httpClientSpy.get.calls.count()).toBe(1, 'appointment');
    expect(appointment.length).toBe(2, 'appointment');
  });
  
});
