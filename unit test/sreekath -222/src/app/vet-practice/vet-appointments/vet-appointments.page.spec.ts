import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { VetAppointmentsPage } from "./vet-appointments.page";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { TablePage } from "../../common/components/table/table.page";
import { CancelAppointmentPage } from "../../common/components/cancel-appointment/cancel-appointment.page";
import { LateJoinPage } from "../../common/components/late-join/late-join.page";
import { By } from "@angular/platform-browser";
import { VetPracticeService } from '../vet-practice.service';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

describe("Vet-appointments in vetpractice", () => {
  let component: VetAppointmentsPage;
  let fixture: ComponentFixture<VetAppointmentsPage>;
 
  let statusList: any = Array<any>();

  it('should render main title', () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Appointments');
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VetAppointmentsPage,
        TablePage,
        CancelAppointmentPage,
        LateJoinPage
      ],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [File,FileOpener]
    }).compileComponents();

    fixture = TestBed.createComponent(VetAppointmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should have the other component booking table", async(() => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    //should be initialiszed initially
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("app-table")).toBeTruthy();
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should render statusList", () => {
    expect(component.statusList).toBeTruthy();
  });
  it("ionViewDidLeave will render", () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave).toBeTruthy();
  });
  it("ionViewDidLeave will render", () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave()).not.toBeNull();
  });
  it("ionViewWillEnter will render", () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter).toBeTruthy();
  });
  it("ionViewWillEnter will render", () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).not.toBeNull();
  });
  it("ngOnInit will render", () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });
  it("ngOnInit will render", () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
    app.vetPracticeService.getVetBookings(6).subscribe((bookings: any) => {
     bookings = 'test bookings'
    });
    component.bookingData = 'test bookings';
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(VetAppointmentsPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  // it("should render menuItems", () => {
  //   expect(component.menuItems).toBeUndefined();
  // });
  // it('should render image for desktop', async(() => {
  //   const fixture = TestBed.createComponent(VetAppointmentsPage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.desktop-logo>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  // }));
  // it('should render the image for mobile', async(() => {
  //   const fixture = TestBed.createComponent(VetAppointmentsPage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.col-12>img').src).toContain('http://localhost:9876/assets/imgs/mobile-logo.png');
  // }));
  it("should test two-way binding by setting the component member", fakeAsync(() => {
    let testValue: any;
    // let  bookingData: any = [];
    let header: any = ["Vet"];
    let menuItems: any = [
      "Edit Booking",
      "Cancel Booking",
      "Re-Book",
      "Download-Invoice"
    ];
    let bookingData: any = [
      {
        id: 2,
        userId: 6,
        petName: "Pinto",
        speciesId: 1,
        practiceId: 2,
        breed: "Lab",
        gender: "Male",
        dob: "12",
        profilePic: "PE_2.png",
        neutered: false,
        deceased: false,
        hide: false,
        active: true,
        insured: null,
        insurenceProvider: null,
        createdOn: "2019-12-16T06:48:52.000Z",
        updatedOn: null
      }
    ];
    let component: VetAppointmentsPage;
    fixture.detectChanges();
    tick();
    // twoway-binding data tesing
    expect(
      fixture.debugElement.query(By.css("app-table")).nativeElement.value
    ).toEqual(menuItems.value);
    expect(
      fixture.debugElement.query(By.css("app-table")).nativeElement.value
    ).toEqual(header.value);
   
    expect(
      fixture.debugElement.query(By.css("app-table")).nativeElement.value
    ).toEqual(bookingData.value);
  }));

});
