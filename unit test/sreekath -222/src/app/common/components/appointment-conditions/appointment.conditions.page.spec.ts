import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule,  } from "@angular/router/testing";
import { AppointmentService } from '../../../pets/appointment.service';


import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { AppointmentConditionsPage } from './appointment.conditions.page';
import { InAppBrowser, InAppBrowserEvent} from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../appointment-conditions/mockStorage';

describe('AppointmentConditionsPage will render', () => {
  let component: AppointmentConditionsPage;
  let fixture: ComponentFixture<AppointmentConditionsPage>;
  let appService: AppointmentService;
  it('should render text', () => {
    const fixture = TestBed.createComponent(AppointmentConditionsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-text').textContent).toContain('Agree with the above conditions...');
  });
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentConditionsPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule],
      providers: [InAppBrowser,AppointmentService,
        {provide: Storage, useClass: MockStorage},]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  // beforeEach(async () => {
  //   component.ngOnInit();
  // });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("Book&pay method should render ", () => {
    spyOn(component, 'bookAndPay');

    const fixture = TestBed.createComponent(AppointmentConditionsPage);
    let button = fixture.debugElement.nativeElement.querySelector('ion-button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.bookAndPay).toHaveBeenCalled();
    });
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.bookAndPay).toBeTruthy();
    expect(app.bookAndPay()).not.toBeNull();
  });
  it("Book&pay method should render ", () => {
    const fixture = TestBed.createComponent(AppointmentConditionsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.bookAndPay).not.toBeNull();
    expect(component.bookAndPay).toBeTruthy();
    let appService: AppointmentService;
    app.appService.bookAppointment(5).subscribe((res) => { console.log(res)});
  });
  it("Book&pay method with Query Param ", () => {
    const fixture = TestBed.createComponent(AppointmentConditionsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.appService.bookAppointment(5).subscribe(
      booking => {
        this.router.navigateByUrl('/payments/success', { queryParams: { session_id: 'zero_transaction', bookingId: booking.data.id } });
      });
  });
 
  it("modal dismiss function", () => {
    const fixture = TestBed.createComponent(AppointmentConditionsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dismiss).toBeTruthy();
  });
  it("modal dismiss function not passing param", () => {
    let data;
    const fixture = TestBed.createComponent(AppointmentConditionsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dismiss(data)).toBeUndefined();
  });
  it("modal dismiss function not passing param", () => {
    const fixture = TestBed.createComponent(AppointmentConditionsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dismiss()).not.toBeNull();
  });
});
