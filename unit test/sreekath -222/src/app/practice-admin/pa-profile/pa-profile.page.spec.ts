import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { PaProfilePage } from './pa-profile.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MockPracticeAdminService } from '../../practice-admin/mock.practice-admin.service';
import {DebugElement} from "@angular/core"; 
import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend,MockConnection } from '@angular/http/testing';
import { PracticeAdminService } from '../practice-admin.service';
import {IonicStorageModule} from '@ionic/storage';
import { Practice } from '../practice';
describe('PaProfile should render', () => {
  let component: PaProfilePage;
  let fixture: ComponentFixture<PaProfilePage>;
  let mockBackend: MockBackend;
  let service:MockPracticeAdminService;
  let practiceService:PracticeAdminService
 
  
  it('should render main title', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('My profile');
  });
  
  it('should render main title', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Practice information');
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaProfilePage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule,IonicStorageModule.forRoot()],
      providers: [MockPracticeAdminService,{provide:XHRBackend,useClass:MockBackend},PracticeAdminService]
    }).compileComponents();

    fixture = TestBed.createComponent(PaProfilePage);
    mockBackend=TestBed.get(XHRBackend);
    component = fixture.componentInstance;
    service = TestBed.get(MockPracticeAdminService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('home image for desktop', async(() => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.pl-3>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  }));
  it('should render "goback', () => {
    expect(component.goback).toBeTruthy();
  });
  it('should render "goback', () => {
    expect(component.goback()).not.toBeNull();
  });
  it('should render "checkDevices', () => {
    expect(component.checkDevices).toBeTruthy();
  });
  it('should render "checkDevices', () => {
    expect(component.checkDevices()).not.toBeNull();
  });
  it('should render "checkDevices', () => {
    expect(component.checkDevices()).toBeUndefined();
  });
  it('should render "getSpecies', () => {
    expect(component.getSpecies).toBeTruthy();
  });
  it('should be "getSpecies" function array will render', () => {
    let species
    expect(component.getSpecies()).not.toBeNull();
    expect(component.getSpecies.length !== 0).not.toBeNull();
    component.speciesList = species;
    component.getUserDetails();
  });  
  it('should render "editProfileEnable', () => {
    expect(component.editProfileEnable).toBeTruthy();
  });
  it('should render "editProfileEnable" pass param', () => {
    let readFormValue;
    expect(component.editProfileEnable()).not.toBeNull();
  });
  it('should render "getUserDetails', () => {
    expect(component.getUserDetails).toBeTruthy();
  });
  it('should render "updateProfile"', () => {
    const model = '';
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
  });
  it('should render "updateProfile"', () => {
    const val = '';
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateSpecies(val)).toBeUndefined();
    const val1 = ['test','test1'];
    expect(component.updateSpecies(val1)).not.toBeNull();
    expect(component.speciesArray).toEqual([]);
    expect(app.isEditable).toBe(true);
  });
  it('should render "updateProfile" pass param', () => {
    let data;
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile).not.toBeNull();
  });
  it('expects method should be intialized and it should be TRUE', () => {
    const dataurl ='www.lucidatechnologies.com/index';
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dataURLtoFile(dataurl)).toBeUndefined();
});
  it('assigning for model',()=>
  {
    const mod = new Practice();
  mod.id=1;
  mod.practiceName= 'applo clinic';
  mod.password =  'lucida123';
  mod.confirmPassword = 'luucida123';
  mod.speciesId = 2312312;
  mod.tag = 'src/assects';
  mod.logo = 'apllo/clinic';
  mod.phoneNo = '9676022850';
  mod.email =  'sameer@gmail.com';
  mod.website = 'www.seemywet.com';
  mod.address1 = 'uk';
  mod.address2 = 'uk';
  mod.country = 'uk';
  mod.postCode = 124324234;
  mod.groupName= 'appolo';
  mod.addOrInvite = true;
  mod.speciesId =235235;
  mod.brandingInfo =[];
  mod.contactFullName = 'sameershaik';
  mod.contactEmail ='sameershaik123@gmail.com';
  mod.contactPhoneNo = '9676022850';
  mod.species = [];
  expect(mod.id).toBe(1);
  expect(mod).not.toBeNull();
  expect(mod.email).toBe('sameer@gmail.com');

  });
  it('should render "updateProfile" pass param', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    component.updateProfile;
    component.isEdit = false;
    const current = [];
    let removedSpecies = [];
    component.model.brandingInfo = [];
    removedSpecies = app.baseList.filter((obj) => {
      return app.selectedSpeciess.indexOf(obj) === -1;
    });
  });
  it('should render "getUserDetails', () => {
    expect(component.getUserDetails()).not.toBeNull();
  });
  it('should render "getUserDetails', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.selectedSpecies.length === 1
    const speciesData ={species:{value:100}};
    const index = 1;
    expect(component.selectedSpecies(speciesData,index)).toBeUndefined();
  });
  it('should render "onPrevious', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious()).not.toBeNull();
  });
  it('should render "onNext', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext()).not.toBeNull();
  });
  it('should render "uploadProfilePic', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic()).not.toBeNull();
  });
  
  it('should render "takePicture', () => {
     const sourceType = [{'type': 'camera'}]
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).not.toBeNull();
  });
  it('should render "updateProfilePic', () => {
    const picture = [{'type': 'image'}] 
    const id= [{'id':'1'}]
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   expect(component.updateProfile).not.toBeNull();
  });
  it('should render "uploadProfilePic', () => {
     const picture = [{'type': 'image'}] 
    const id= [{'id':'1'}]
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
  // expect(app.uploadProfilePic(picture,id)).not.toBeNull();
  });
  it('should render "updateStorage', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   expect(app.updateStorage).not.toBeNull();
  });
  it('should render "updateStorage', () => {
    const pic = { 'profilePic': 'username',};
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   // expect(app.updateStorage(pic)).not.toBeNull();
  //  expect(component.updateStorage(pic)).toBeUndefined();
  });
  it('should render "selectImage', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage()).not.toBeNull();
  });
  it('should render "updateProfile', () => {
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile()).not.toBeNull();
  });
  it('should render "updateStorage', () => {
    const store = {profilePic:'image.png'}
    const pic = store.profilePic
    const fixture = TestBed.createComponent(PaProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateStorage(pic)).not.toBeNull();
  });

  it('should render "profilePicUpdate', () => {

     const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    expect(component.profilePicUpdate(event)).toBeUndefined();
  });
  it('should render "getUserDetails" pass mock data', () => {
  //   expect(app.getPracticeSlots(practiceId, date).then(res =>{
  //     this.getData = res.data;
  //     this.getData.practiceId = 5;
  //  }))
  const fixture = TestBed.createComponent(PaProfilePage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  let profileData = service.getPaProfileData();
    // expect(app.getUserDetails().toBe(res =>{
    //   this.data = res;
    // }));
    let res
    app.model = res;
    app.originalSpeciesList = res;
   // app.originalSpeciesList.map(list => list.species.isActive = true);
    app.speciesList.forEach(el => {
      app.originalSpeciesList.forEach(ell => {
          el = ell.species;
          this.baseList.push(ell.species);
          this.selectedSpeciess.push(ell.species);
      });
      this.species.push(el);
    });
   // this.species = _.sortBy(this.species, e => !e.isActive);

  });
  it("petData fetching from MockPetService", () => {
      let profileData = service.getPaProfileData();
    // Arrange
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: profileData
          })
        )
      );
    });
  });


  it('camera',()=>{
    let options:CameraOptions; 
    expect(component.camera.getPicture(options)).not.toBeNull();
  });
});
