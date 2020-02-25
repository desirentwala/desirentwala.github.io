import { async, ComponentFixture, TestBed, fakeAsync, tick  } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BookingsPage } from './bookings.page';
import { TablePage } from '../../common/components/table/table.page';
import { By } from '@angular/platform-browser';
import { CancelAppointmentPage } from '../../common/components/cancel-appointment/cancel-appointment.page';
import { LateJoinPage } from '../../common/components/late-join/late-join.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MockPetService} from '../mock.pets.service';
import { CommonService } from '../../common/services/common.service';
import { XHRBackend, HttpModule, Response, RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import * as moment from 'moment';
import { PetService } from '../pets.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Bookings } from '../mockbookings';
import { Observable } from 'rxjs';


describe('Booking Appointmets', () => {
  let component: BookingsPage;
  let fixture: ComponentFixture<BookingsPage>;
  let CommonService: CommonService;
  let service: MockPetService;
  let service1: PetService;
  let httpClient: HttpClient;
  let mockBackend: MockBackend;

  // window.moment = moment;
  it('should render main title', () => {
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Appointments');
  });


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingsPage, TablePage, CancelAppointmentPage, LateJoinPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule, FormsModule],
      providers: [{provide: XHRBackend, useClass: MockBackend}, File, FileOpener,PetService]
    }).compileComponents()
    .then(() => {
        fixture = TestBed.createComponent(BookingsPage);
        component = TestBed.createComponent(BookingsPage).componentInstance;
       });
    httpClient = TestBed.get(HttpClient);
    fixture = TestBed.createComponent(BookingsPage);
    service = TestBed.get(MockPetService);
    service1 = TestBed.get(PetService);
    mockBackend = TestBed.get(XHRBackend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  // beforeEach(async () => {
  //   component.ngOnInit();
  // });
  it('should have a defined component', () => {
    expect(component).toBeDefined();
});
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit should render', () => {
    expect(component.ngOnInit).toBeTruthy();
  });
  it('ngOnInit should be exhis undefiend if the data missmatch', () => {
    let pet: any;
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).toBeUndefined();
  });
  it('sortedData declaration should be exhist', () => {
    let pet: any;
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.sortedData).toBeUndefined();
  });
  it('ionViewWillEnter method should exist n render', () => {
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter).toBeTruthy();
  });
  it('ionViewWillEnter method should pass param', () => {
    let param: any;
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter(param)).toBeUndefined();
  });
  it('ionViewWillEnter method should pass param', () => {
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).not.toBeNull();
  });
  it('ionViewDidLeave method should exist n render', () => {
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave).toBeTruthy();
  });
  it('ionViewDidLeave method should pass param', () => {
    let param: any;
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave(param)).toBeUndefined();
  });
  it('ionViewDidLeave method should pass param', () => {
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave()).not.toBeNull();
  });
  it('should have the other component booking table', async(() => {
    const fixture = TestBed.createComponent(BookingsPage);
    fixture.detectChanges();
    // should be initialiszed initially
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-table')).toBeTruthy();
    fixture.detectChanges();
  }));
  it('should test two-way binding by by getting booking appointment', (() => {
    const appointments = service.getAllBookingsByUser();
    // twoway-binding data tesing
    let component: BookingsPage;
    expect(appointments).not.toBeNull();
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.css('app-appointment-card'));
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy;
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: appointments
          })
        )
      );
    });
 }));

  it('should test two-way binding by setting the component member',
  fakeAsync(() => {
      let testValue: any;
      const  header: any = ['Vet'];
      const menuItems: any = ['Edit Booking', 'Cancel Booking', 'Re-Book' , 'Download-Invoice'];

      let component: BookingsPage;
      fixture.detectChanges();
      tick();
      // twoway-binding data tesing
      expect(fixture.debugElement.query(By.css('app-table')).nativeElement.value).toEqual(menuItems.value);
      expect(fixture.debugElement.query(By.css('app-table')).nativeElement.value).toEqual(header.value);
}));
// it('should render image for desktop', async(() => {
//   const fixture = TestBed.createComponent(BookingsPage);
//   fixture.detectChanges();
//   const compiled = fixture.debugElement.nativeElement;
//   expect(compiled.querySelector('div.desktop-logo>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
// }));
// it('should render the image for mobile', async(() => {
//   const fixture = TestBed.createComponent(BookingsPage);
//   fixture.detectChanges();
//   const compiled = fixture.debugElement.nativeElement;
//   expect(compiled.querySelector('div.col-12>img').src).toContain('http://localhost:9876/assets/imgs/mobile-logo.png');
// }));

  it('should render ngOnDestroy', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnDestroy').and.callFake(() => console.log('fake ngOnDestroy'));
});
  it('should render ngOnInit', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
});
  it('should render ngOnChanges', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const  component = fixture.componentInstance;
  fixture.detectChanges();
  spyOn(component, 'ngOnChanges').and.callFake(() => console.log('fake ngOnChanges'));
});
  it('ngOnInit method should pass param', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnInit()).not.toBeNull();
});
  it('ngOnInit method should exist n render', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnInit).toBeTruthy();
});
  it('ngOnDestroy method should pass param', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnDestroy()).not.toBeNull();
});
  it('ngOnDestroy method should exist n render', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnDestroy).toBeTruthy();
});
  it('ngOnChanges method should exist n render', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnChanges).toBeTruthy();
});
  it('ngOnChanges method should exist n render', () => {
  const fixture = TestBed.createComponent(BookingsPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.ngOnChanges).not.toBeNull();
});


  it('ngonchanges', () => {
  expect(component.ngOnChanges()).toBeUndefined();

});


  it('ngOnInit', () => {
  expect(component.ngOnInit()).not.toBeNull();
});
it('ngOnit',()=>
{
  let tempArr=[
  { id:11,
  userId:12,
    email:"manoj@gmail.com",
    petId:233,
    firstName:"manoj",
    bookingId:12,
  
    speciesId:21,
    // slot: string;
    slotId:121,
    paymentId:33,
    status: 'Awaiting confirmation',
    petName:'robert',
    practiceId:3,
    practicerName:'pratice',
    price: 12211,
    isPrivate:true,
  }];

  // let tempArr:any[]=[];
  // tempArr.push(book)





  component.sortedData = tempArr;
  expect(component.sortedData).not.toBeUndefined();

// });


});
});
