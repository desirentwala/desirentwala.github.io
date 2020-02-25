import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PracticerInfoComponent } from './practicer-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { VhdAdminService } from '../vhd-admin.service';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { MockStorage } from '../practicer-info/mockStorage';
import { Practice } from 'src/app/practice-admin/practice';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { concatMap } from 'rxjs/operators';
describe('Practicer InfoComponent will render', () => {
  let component: PracticerInfoComponent;
  let fixture: ComponentFixture<PracticerInfoComponent>;
  let service:VhdAdminService;
  let practiceService: PracticeAdminService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticerInfoComponent ],
      imports: [FormsModule,HttpClientModule ,
        HttpClientTestingModule,RouterTestingModule,HttpModule,IonicModule.forRoot()],
      providers:[VhdAdminService,Camera,{provide: Storage, useClass: MockStorage},PracticeAdminService],
        
    }).compileComponents();

    fixture = TestBed.createComponent(PracticerInfoComponent);
    component = fixture.componentInstance;
    service=TestBed.get(VhdAdminService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("checkDevices method should render", () => {
    const vetDetailsObj = {}
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
   // comp['vetData'] = vetDetailsObj;
    expect(comp.checkDevices()).toBeUndefined();
  });
  it("getSpecies method should render", () => {
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.getSpecies()).toBeUndefined();
  });
  it("getUserDetails method should render", () => {
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.getUserDetails()).toBeUndefined();
    component.getUserDetails();
    const Practice = {
      id1: 1,
      practiceName: 'lucida',
      password: 'test123',
      confirmPassword: 'test123',
      tag: 'version1',
      logo: 'sample',
      phoneNo: '8639355011',
      email: 'shaik.sameer@lucidatechnologies.com',
      website: 'www.lucidatechnologies.com/index',
      address1: 'bansankari', 
      address2: '80 feet road',
      country: 'india',
      postCode: '560001',
      groupName: 'sample',
      addOrInvite: true,
      speciesId: 121,
      brandingInfo: Array,
      contactFullName: 'sameer',
      contactEmail: 'shaiksameeer@lucidatechnologies.com',
      contactPhoneNo: '8639355011',
      species: ['dog','cat'],
      prefix: 'male'
  }
    //expect(component.model).toEqual(Practice);
  }); 
  it("expects onPrevious should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious).toBeTruthy();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).toBeUndefined();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).not.toBeNull();
  });
  it("expects onNext should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext).toBeTruthy();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).toBeUndefined();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).not.toBeNull();
  });
  it("updateProfile method should render", () => {
    const speciesData = {species: 'dog',id:12} ;
    const index =0

    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.selectedSpecies(speciesData,index)).toBeUndefined();
    component.selectedSpecies(speciesData,index);
    expect(component.selectedSpecies.length).toBe(2)
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture).toBeTruthy();
  });
  it("passsing sourceType As Param", () => {
    let sourceType: any;
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).toBeUndefined();
  });
  it("passsing sourceType As Param", () => {
    const url = 'www.lucidatechnologies.com/index';
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dataURLtoFile(url)).toBeUndefined();
  });
  it("expects goback method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.goback()).not.toBeNull();
  });
  it("selectImage method should render", () => {
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage()).not.toBeNull();
  });
  it("updateProfile method should render", () => {
    const Practice= {
      id : 32,
      practiceName: 'sameer',
      password: 'lucida123',
      confirmPassword: 'lucida123',
      tag: 'sample',
      logo: '../../assects/sample.png',
      phoneNo: '9676022850',
      email: 'shaiksameer@lucidatechnologies.com',
      website: 'www.lucidatechnologies.com/index',
      address1: 'bansankari', // address
      address2: 'banglore',
      country: 'india',
      postCode: '560100',
      groupName: '1212',
      addOrInvite: true,
      speciesId: 232,
      brandingInfo: [121,211,1212],
      contactFullName: 'suresh',
      contactEmail: 'suresh@lucidatechnologies.com',
      contactPhoneNo: '1321312312312',
      species: ['test','test123'],
      prefix: 3
    }
   // const model = new Practice();
    practiceService: PracticeAdminService;
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.updateProfile).not.toBeNull();
  });
  it("updateSpecies method should render", () => {
    const val = ['dog','cat'] ;
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.updateSpecies(val)).not.toBeNull();
  });
  it("profilePicUpdate method should render", () => {
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    const fixture = TestBed.createComponent(PracticerInfoComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    expect(comp.profilePicUpdate(event)).toBeUndefined();
    component.profilePicUpdate(event);
    expect(component.profilePic).toBe(undefined);
  });
  it("data method should set in component", () => {
    component.data = '';  
    expect(component.data).toBeUndefined();
   expect (component.practiceData).toBe(undefined);
    component.getSpecies();
  });
  it("data method should set in component", () => {
    const picture = {imgae:'image.png'}
    const id      = 12;
    component.uploadProfilePic(picture,id)
    expect(component.practiceService.uploadProfilePic).toBe(picture);
  });
  it("updateProfile method should set in component", () => {
    component.updateProfile()
    expect(component.baseList).toEqual(undefined);
    expect(component.selectedSpecies).toEqual('testspecies');
  });
});
