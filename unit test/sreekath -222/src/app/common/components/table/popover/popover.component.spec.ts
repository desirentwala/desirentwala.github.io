import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PopoverComponent } from './popover.component';
import { NavParams } from '@ionic/angular';
import { NavParamsMock } from '../popover/navParamsMock';

describe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;
  const data = {data: 'sampledata'};
  const navParams = new NavParams(data);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverComponent ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule],
      providers: [{provide: NavParams, useClass: NavParamsMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  it('should use injected data', () => {
    expect(component['data']).toEqual(undefined);
  });
  it('i am a unit test', () => {
    const navParams = fixture.debugElement.injector.get(NavParams)

    navParams.get =
      jasmine
        .createSpy('get')
        .and
        .callFake((param) => {
          const params = {
            'param1': 'value',
            'param2':  'value'
          }
          return params[param]
        })
  })
  it("expects close method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(PopoverComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.close()).not.toBeNull();
  });
  it("expects editBooking method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(PopoverComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editBooking()).not.toBeNull();
    component.selectedAppointment = '';
  });
  it("expects menuItemClick method should be intialise and not null", () => {
    const fixture = TestBed.createComponent(PopoverComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.menuItemClick()).not.toBeNull();
  });
  it("expects menuItemClick method should be intialise and not null", () => {
    const menuName = 'Cancel Booking';
    const menuName1 = 'Re-Book';
    const menuName2 = 'Download-Invoice';
    const menuName3 = 'Joining Late';
    const menuName4 = 'Edit Booking';
    const menuName5 = 'Confirm Appt.';
    const menuName6 = 'Cancel Appt.';
    const fixture = TestBed.createComponent(PopoverComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.menuItemClick(menuName)).not.toBeNull();
    expect(component.menuItemClick(menuName1)).not.toBeNull();
    expect(component.menuItemClick(menuName2)).not.toBeNull();
    expect(component.menuItemClick(menuName3)).not.toBeNull();
    expect(component.menuItemClick(menuName4)).not.toBeNull();
    expect(component.menuItemClick(menuName5)).not.toBeNull();
    expect(component.menuItemClick(menuName6)).not.toBeNull();
  });
 // this.menuArr = this.navParams.get('menuItems');
   // this.selectedAppointment = this.navParams.get('Data');

  // it('should render cancelBooking method', () => {
  //   expect(component.cancelBooking).toBeTruthy();
  // });
});
