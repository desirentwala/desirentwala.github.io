import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewCustomerPage } from './view-customer.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from "@angular/core"; 
import { TablePage } from '../../common/components/table/table.page';
import { CancelAppointmentPage } from '../../common/components/cancel-appointment/cancel-appointment.page';
import { LateJoinPage } from '../../common/components/late-join/late-join.page';
import { PetService } from 'src/app/pets/pets.service';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

describe('ViewCustomerPage will render', () => {
  let component: ViewCustomerPage;
  let fixture: ComponentFixture<ViewCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerPage,TablePage,CancelAppointmentPage,LateJoinPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule],
      providers: [PetService,File,FileOpener]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });

  it('should initialize the ngOninIt', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges).toBeTruthy();
    expect(app.ngOnChanges()).not.toBeNull();
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it("should render ngOnChanges", () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnChanges').and.callFake(() => console.log('fake ngOnChanges'));
  });

  it('should initialize the basePath', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.basePath).not.toBeNull();
  });
  it('should initialize the onSelect', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.onSelect()).not.toBeNull();
  });
  it('should initialize the navigateToAppointment', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateToAppointment()).not.toBeNull();
  });
  it('should initialize the showMorePets', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    component.petData = ['testsata']
    expect(app.showMorePets()).not.toBeNull();
    component.MAX_PET += 3;
    if(app.petData){
        app.MAX_PET += this.petData.length;
      }
      expect(component.showMorePets()).not.toBeNull();
      expect(component.showLessPets()).not.toBeNull();
  });
  it('should initialize the showLessPets', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    component.petData = ['testdata']
    expect(app.showLessPets()).not.toBeNull();
    component.MAX_PET -= 3;
  });
  it('should initialize the getAllAppointments', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    component.petData = ['testdata']
    expect(app.getAllAppointments()).not.toBeNull();
  });
  it('should initialize the getAllAppointments', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(component.menuItems).toEqual(['Edit Booking', 'Cancel Booking', 'Re-Book', 'Invoice']);
    expect(component.statusList).toEqual(['Awaiting confirmation', 'Confirmed', 'Cancelled', 'Completed']);
  });
  it('should initialize the getAllAppointments', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    component.petData = ['testdata']
    expect(app.getAllAppointments).not.toBeNull();
    app.petService.getAllBookingsByUser(5).subscribe((res: any) => {
        res.bookings.forEach(bookings => {
          
        });
        this.sortedData = this.tempArr.sort((a, b) => {
          return this.statusList.indexOf(a.status) - this.statusList.indexOf(b.status);
        });
        this.bookingData = this.sortedData.filter(B => B.petId === this.selectedPet.id);
      });

  });
  it('should initialize the editCustomer', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.editCustomer()).not.toBeNull();
  });
  it('should initialize the editPet', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.editPet()).not.toBeNull();
  });
  it('should initialize the defaultPetSelection', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.defaultPetSelection()).not.toBeNull();
  });
  it('should initialize the update', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.update()).not.toBeNull();
  });
  it('should initialize the addPet', async () => {
    const fixture = TestBed.createComponent(ViewCustomerPage);
    const app = fixture.debugElement.componentInstance;
    expect(app.addPet()).not.toBeNull();
  });
  it('should initialize the delete', async () => {
    const pet = { 'id':123}
      const id = pet.id
    const fixture = TestBed.createComponent(ViewCustomerPage);
   // const app = fixture.debugElement.componentInstance;
    const app = fixture.componentInstance;
    app['delete(id)'] = id;
    expect(app.delete(id)).not.toBeNull();
  });
});
