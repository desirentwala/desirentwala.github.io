import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MockStorage } from '../edit-pet-owner/mockStorage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { EditVetPage } from './edit-vet.page';

describe('EditVetPage will render', () => {
  let component: EditVetPage;
  let comp : EditVetPage;
  let fixture: ComponentFixture<EditVetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVetPage ],
      imports: [HttpClientTestingModule,IonicModule.forRoot(),RouterTestingModule,FormsModule],
      providers: [{provide: Storage, useClass: MockStorage},Camera]
    }).compileComponents();

    fixture = TestBed.createComponent(EditVetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('edit vet page should be render', () => {
    expect(component).toBeTruthy();
  });
  it("expects onPrevious should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious).toBeTruthy();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).toBeUndefined();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).not.toBeNull();
  });
  it("expects onNext should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext).toBeTruthy();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).toBeUndefined();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    component.imageFilePathChange(event);
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture).toBeTruthy();
  });
  it("passsing sourceType As Param", () => {
    let sourceType: any;
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).toBeUndefined();
  });
  it("selectImage method should render", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage()).not.toBeNull();
  });
  it("getUserDetails method should render", () => {
    const vet = {id:123}
    const id = vet.id
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getUserDetails(id)).not.toBeNull();
    expect(app.getUserDetails(id)).toBeUndefined();
    component.getUserDetails();
    expect(component.vetData).toBe(undefined);
  });
  it("ngOnChanges method should render", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges()).not.toBeNull();
  });
  it("getAdminSpecies method should render", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAdminSpecies()).toBeUndefined();
  });
  it("ngOnInit method should render", () => {
    component.ngOnInit()
    expect(component.VHDA).toBe(false);
  });
  it("updateProfile method should render", () => {
    const vetDetailsObj = {
      id: 23,
      firstName: 'sameer',
      lastName: 'shaik',
      email: 'shaiksameer@lucidatechnologies.com',
      mobile: 9848022338,
      profilePic: 'image.png',
      isActive: true,
      practiceId: 12334,
      userName: 'lucida123',
      password: 'demo123'
    }
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['vetData'] = vetDetailsObj;
    expect(comp.updateProfile()).toBeUndefined();
  });
  it("showPassword method should render", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showPassword()).not.toBeNull();
    expect(app.showPassword()).toBeUndefined();
  });
  it("close method should render", () => {
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.close()).toBeUndefined();
    expect(app.close()).not.toBeNull();
  });
  it("delete method should render", () => {
    const data = { 'sampledata':'testsample'}
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   // expect(app.delete(data)).toBeUndefined();
    expect(app.delete(data)).not.toBeNull();
  });
  it("onSearchUsername method should render", () => {
    const data = '';
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onSearchUsername()).not.toBeNull();
    expect(component.isUsernameValid).toBe(false);
  });
  it("dataURLtoFile method should render", () => {
    const url = '';
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dataURLtoFile(url)).not.toBeNull();
  });
  it("uploadPicture method should render", () => {
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.uploadPicture(event)).toBeUndefined();
  });
  it("vetInfo method should render", () => { 
    const v = '';
    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['vetInfo'] = '';
    expect(comp.vetInfo).not.toBeNull();
    expect(comp.vet).toBe(undefined)
  });
  it("updateProfile method should render", () => {
    const speciesData = {'species': 'dog'} ;
    const index =0

    const fixture = TestBed.createComponent(EditVetPage);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.selectedSpecies(speciesData,index)).toBeUndefined();
  });
});
