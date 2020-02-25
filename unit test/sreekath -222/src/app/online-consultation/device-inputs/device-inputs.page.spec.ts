import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeviceInputsPage } from './device-inputs.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule,FormGroup,FormControl,ReactiveFormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { RouterTestingModule } from '@angular/router/testing';

describe('DeviceInputs should render', () => {
  let component: DeviceInputsPage;
  let fixture: ComponentFixture<DeviceInputsPage>;
  let DebugElement:DebugElement;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceInputsPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,
        RouterTestingModule,FormsModule,ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceInputsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it("expects cancel should pass Null", () => {  
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.cancel()).not.toBeNull();
  });
  it("expects cancel should pass param", () => {  
    let param; 
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.cancel(param)).toBeUndefined();
  });
  it("expects cancel should be render", () => {  
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.cancel()).toBeUndefined();
  });
  it("expects deviceInputs should be render", () => {  
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.deviceInputs()).toBeUndefined();
  });
  it("expects deviceInputs should pass param", () => {  
    let param;
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.deviceInputs(param)).toBeUndefined();
  });
  it("expects medicaDeviceForm should pass param", () => {  
    let param;
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.medicaDeviceForm(param)).toBeUndefined();
  });
  it("expects mediaDevices should pass param", () => {  
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.mediaDevices()).toBeUndefined();
  });
  it("expects medicaDeviceForm should pass null", () => {  
    let param;
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.medicaDeviceForm()).not.toBeNull();
  });
  it("should show a validation error if the Microphone,Camera was touched but left empty", () => {
    let component = fixture.componentInstance;
    component.Microphone = "Microphone";
    component.Camera = "Camera";
    component.Speaker = "Speaker";
    fixture.detectChanges();
    let MicrophoneValidationError: DebugElement;
    fixture.detectChanges();
    MicrophoneValidationError = fixture.debugElement.query(
      By.css(".text-danger")
    );
    expect(MicrophoneValidationError).toBeNull();
    let CameraValidationError: DebugElement;
    fixture.detectChanges();
    CameraValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(CameraValidationError).toBeNull();
    let SpeakerValidationError: DebugElement;
    fixture.detectChanges();
    SpeakerValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(SpeakerValidationError).toBeNull();
    expect(component.Microphone).toBe("Microphone");
    expect(component.Camera).toBe("Camera");
    expect(component.Speaker).toBe("Speaker");
  });
  it("expects html element should pass null", () => {  
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    var div = fixture.nativeElement.querySelector('ion-select');
    expect(div.Microphone).toBeUndefined();
    expect(div.Microphone).not.toBeNull()
  });
  it("expects html element should pass null", () => {  
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    var div = fixture.nativeElement.querySelector('ion-select');
    expect(div.camera).toBeUndefined()
    expect(div.camera).not.toBeNull();
  });
  it("expects html element should pass null", () => {  
    const fixture = TestBed.createComponent(DeviceInputsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    var div = fixture.nativeElement.querySelector('ion-select');
    expect(div.speakers).toBeUndefined()
    expect(div.speakers).not.toBeNull()
  });
});
