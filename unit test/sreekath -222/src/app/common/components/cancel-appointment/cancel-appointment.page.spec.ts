import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { CancelAppointmentPage } from './cancel-appointment.page';
import { TableService } from '../../services/table.actions.service';

describe('CancelAppointment should render', () => {
  let component: CancelAppointmentPage;
  let fixture: ComponentFixture<CancelAppointmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelAppointmentPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule],
      providers: [CommonService,TableService]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  beforeEach(async () => {
    component.ngOnInit();
  });
  it("cancel method should render", () => {
    const fixture = TestBed.createComponent(CancelAppointmentPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.cancelBooking).toBeTruthy();
  });
  it("cancel method pass the pram", () => {
    let bookingId:number;
    const fixture = TestBed.createComponent(CancelAppointmentPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.cancelBooking(bookingId)).toBeUndefined();
  });
  it("cancel method pass resultObject", () => {
    const resultObj = 'PO'
    const fixture = TestBed.createComponent(CancelAppointmentPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.cancelBooking()).not.toBeNull();
    expect(component.cancelBooking()).not.toBeNull();
    app.tableService.cancelAppointment(5).subscribe(cancelled => {
    });
    expect(component.bookingData).toBeUndefined();
    expect(component.bookingData).toBeUndefined();
  });

  
  it("ngOnInit method should render", () => {
    const fixture = TestBed.createComponent(CancelAppointmentPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
    expect(component.value).toBeUndefined();

  });
  it("ngOnInit method should render", () => {
     const service = CommonService;
    const fixture = TestBed.createComponent(CancelAppointmentPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   expect(app.service).toBeUndefined();
   expect(app.service).toBeUndefined();

  });
  it("ngOnInit method not to be Null", () => {
    const fixture = TestBed.createComponent(CancelAppointmentPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.ngOnInit()).not.toBeNull();
    const value =[1,2,3,4]
    component.value = '12323232';
    expect(component.value).not.toBeNull();
    expect(component.bookingData).toBeUndefined();
  });
  it("cancelBooking method should render", () => {
    const obj = {
      flag: "PO",
      comments: "comments",
      email: "petowner.123@gmail.com",
      firstName: "manoj",
      slot: { vet: "dog", startsAt: "17-02-2020" },
      practiceName: "applo clinic",
      practiceEmail: "lucidatechnologies.com",
      vetName: "kl george",
      vetEmail: "george@gmail.com",
      petName: "dog"
    };
    const fixture = TestBed.createComponent(CancelAppointmentPage);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['obj'] = obj;
    comp['role'] = "PO";
    comp['POName'] = obj.firstName;
    comp['POemail'] = obj.email;
    expect(comp.cancelBooking()).toBeUndefined();
  });
});
