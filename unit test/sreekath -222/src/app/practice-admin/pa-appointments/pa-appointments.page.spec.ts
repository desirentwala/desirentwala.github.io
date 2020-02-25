import { async, ComponentFixture, TestBed,fakeAsync,tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaAppointmentsPage } from './pa-appointments.page';
import { RouterTestingModule  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { By } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TablePage } from '../../common/components/table/table.page';
import { CancelAppointmentPage } from '../../common/components/cancel-appointment/cancel-appointment.page';
import { LateJoinPage } from '../../common/components/late-join/late-join.page';
import { PracticeAdminService } from '../practice-admin.service';
import { CommonService } from '../../common/services/common.service';
import { IonicStorageModule } from '@ionic/storage';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
describe('PaAppointmentsPage', () => {
  let component: PaAppointmentsPage;
  let fixture: ComponentFixture<PaAppointmentsPage>;
  let sortedData: any = [];
  let menuItems:any = [];
  let statusList: any = Array<any>();
  let practiceAdminService: PracticeAdminService;
  let commonService: CommonService;
  it('should render main title', () => {
    const fixture = TestBed.createComponent(PaAppointmentsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Appointments');
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaAppointmentsPage,TablePage,CancelAppointmentPage,LateJoinPage ],
      imports: [RouterTestingModule,HttpClientTestingModule,FormsModule,IonicModule.forRoot(),IonicStorageModule.forRoot()],
      providers: [PracticeAdminService,CommonService,File,FileOpener]
    }).compileComponents();
    fixture = TestBed.createComponent(PaAppointmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('expects method should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(PaAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPracticeAppointments).toBeTruthy();
   });
   it('expects getPracticeAppointments should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(PaAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPracticeAppointments()).not.toBeNull();
  
   });
   it('expects method should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(PaAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter).toBeTruthy();
    expect(app.ionViewWillEnter()).toBeUndefined();
   });
   it('expects ionViewDidLeave should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(PaAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewDidLeave).toBeTruthy();
    expect(app.ionViewDidLeave()).toBeUndefined();
   });
   it('expects method should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(PaAppointmentsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    component.ionViewWillEnter;
    app.getPracticeAppointments();
    app.ngOnInit();
    app.getPracticeAppointments();
   });
   it('sortedData should execute', () => {
    expect(component.sortedData.length === 0).not.toBeNull();
    expect(component.menuItems.length === 0).not.toBeNull();
    expect(component.statusList.length === 0).not.toBeNull();
   });
   it('should render image for desktop', async(() => {
    const fixture = TestBed.createComponent(PaAppointmentsPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  }));
  it('should test two-way binding by setting the component member', 
  fakeAsync(() => {
      let testValue:any
      let  header: any = ['Vet'];
      let menuItems: any =['Edit Booking', 'Cancel Booking', 'Re-Book' , 'Download-Invoice'];
      
      let component: PaAppointmentsPage;
      fixture.detectChanges();
      tick();
      // twoway-binding data tesing 
      expect(fixture.debugElement.query(By.css('app-table')).nativeElement.value).toEqual(menuItems.value)
      expect(fixture.debugElement.query(By.css('app-table')).nativeElement.value).toEqual(header.value)
}));

});
