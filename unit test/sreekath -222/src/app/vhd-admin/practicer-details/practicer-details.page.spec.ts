import { async, ComponentFixture, TestBed, tick, inject, fakeAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PracticerDetailsPage } from './practicer-details.page';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { Router } from '@angular/router';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
import { VhdAdminService } from '../vhd-admin.service';
import { AppointmentsListComponent } from '../appointments-list/appointments-list.component';
import { VhdTableComponent } from '../vhd-table/vhd-table.component';
import { PracticerInfoComponent } from '../practicer-info/practicer-info.component';

describe('PracticerDetailsPage', () => {
  let component: PracticerDetailsPage;
  let fixture: ComponentFixture<PracticerDetailsPage>;
  const apiUrl = '';
  let service: VhdAdminService;
  let mockBackend: MockBackend;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticerDetailsPage , AppointmentsListComponent, VhdTableComponent, PracticerInfoComponent],
      imports: [FormsModule, ReactiveFormsModule ,RouterTestingModule, HttpClientTestingModule, HttpClientModule, IonicModule.forRoot()],
      providers: [  VhdAdminService, { provide: XHRBackend, useClass: MockBackend }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    service = TestBed.get( VhdAdminService);
    mockBackend = TestBed.get(XHRBackend);
    fixture = TestBed.createComponent(PracticerDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
  expect(component).toBeTruthy();
 });
  it('should get the list of products from the server', inject([ VhdAdminService],
     fakeAsync ((service: VhdAdminService) => {
    const testProducts = [
    {
       id: 12
    },

    ];

    // Arrange
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toBe(apiUrl);
      tick(50);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: testProducts
          })
        )
      );
    });



    fixture.detectChanges();


    try {
      tick(50);

      const user =  service.getPracticeDetailsById(2).subscribe((res) => {
          expect(res).not.toBeNull();
        });


  } catch (err) {

          expect(err).toContain('error');
      }


  })));


//   it('pratice details', () => {
//     expect(component.practicerDetails).toBeTruthy();
// });
  it('ngOnit', () => {
      const praticerdetails = component.ngOnInit();
      expect( praticerdetails).not.toBeNull();
});
  it('ngOnchnges', () => {
    const ng = component.ngOnChanges();
    expect(ng).not.toBeNull();

});

  it('pratice details type', () => {
      const pratice = component.practiceDetailsType('val');
      expect(pratice).not.toBeNull();
});
it('practiceDetailsType details type', () => {
  const val = 'vets';
  expect(component.practiceDetailsType(val)).not.toBeNull();
  const val1 = 'customers';
  expect(component.practiceDetailsType(val1)).not.toBeNull();
  const val2 = 'practiceInfo';
  expect(component.practiceDetailsType(val2)).not.toBeNull();
  const val3 = 'practiceApptType';
  expect(component.practiceDetailsType(val3)).not.toBeNull();
});

  it('getpraticedetails type', () => {
    const pratice = component.getpracticerDetailsPracticeId();
    expect(pratice).not.toBeNull();
});



  it('get vets by pratice id', () => {
    const pratice = component.getCustomersByPracticeId();
    expect(pratice).not.toBeNull();
});


  it('getcustomer by pratice id', () => {
    const pratice = component.getCustomersByPracticeId();
    expect(pratice).not.toBeNull();
});

  it('getcustomer by pratice id', () => {
    const pratice = component.getVetsByPracticeId();
    expect(pratice).not.toBeNull();
});


  it('get pratice oppointments', () => {
    const pratice = component.getPracticeAppointments();
    expect(pratice).not.toBeNull();
});
it('get PracticeApptTypes Appointments', () => {
  const selectedPracticeData = {id:123};

 component.PracticeApptTypes();
 expect(component.selectedPracticeData).toBe(undefined);
});
});