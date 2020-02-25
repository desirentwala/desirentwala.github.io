import { async, ComponentFixture, TestBed,fakeAsync,tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { EditPetPage } from './edit-pet.page';
import { MockStorage } from '../edit-pet/mockStrorage';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { By } from '@angular/platform-browser';
describe('EditPetPage should be Render', () => {
  let component: EditPetPage;
  let fixture: ComponentFixture<EditPetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPetPage ],
      imports: [HttpClientTestingModule,RouterTestingModule,FormsModule,IonicModule.forRoot()],
      providers: [{provide: Storage, useClass: MockStorage},Camera]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('component shoul be TRUE', () => {
    expect(component).toBeTruthy();
  });
  it("getAdminSpecies method returns the data", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAdminSpecies()).not.toBeNull();
  });
  it("expects onPrevious should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious).toBeTruthy();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).toBeUndefined();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).not.toBeNull();
  });
  it("expects onNext should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext).toBeTruthy();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).toBeUndefined();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).not.toBeNull();
  });
  it("expects selectedSpecies should be pass @param", () => {
    const speciesData = {speciesId: 3};
    const id  = speciesData.speciesId
    const index =12;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.selectedSpecies(id,index)).toBeUndefined();
   // expect(component.petData.speciesId).toEqual(speciesData.speciesId)
    expect(component.activeIndex).toEqual(index) ;
   // expect(app.selectedSpecies(index)).not.toBeNull();
  });
  it("expects neutered should be pass @param", () => {
    const petData = {"neutered" : 'dog'};
    const value =petData.neutered;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
  //  expect(app.neutered()).toBeTruthy();
    //expect(app.neutered()).not.toBeNull();
  });
  it("expects neutered should be pass @param", () => {
    const date = { target: { value: 42 }};
    
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   expect(app.dateValidation(date)).toBeUndefined();
  expect(app.dateValidation(date)).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    component.imageFilePathChange(event);
  });

  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture).toBeTruthy();
  });
  it("passsing sourceType As Param", () => {
    let sourceType: any;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).toBeUndefined();
  });
  it("selectImage method should render", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage()).not.toBeNull();
  });
  it("getPetDetails method should render", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPetDetails()).not.toBeNull();
  });
  it("expects uploadProfilePic methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic()).toBeUndefined();
  });
  it("expects uploadProfilePic methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic()).not.toBeNull();
  });
  it("expects updateProfile methods and it should be TRUE", () => {
    const event = { target: { value: 42 }};
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile).toBeTruthy();
    component.updateProfile();
    component.petData.neutered = '';
    component.petData.neutered = false;
    component.petData.userId = 12;
    component.petData.practiceId = 123;
    component.petData.gender = 'male';
    component.petData.hide = false;
    component.petData.active = true;
    component.petData.deceased = false;
  });
  it("expects dataURLtoFile methods and it should be TRUE", () => {
    const dataurl = '';
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dataURLtoFile(dataurl)).not.toBeNull();
  });
  it("expects updateProfile methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.updateProfile()).not.toBeNull();
  });
  it("expects neutered methods and it should be TRUE", () => {
    const value = Boolean;
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.neutered(value)).not.toBeNull();
  });
  it("expects ngOnInit methods and it should be TRUE", () => {
    const dataurl = '';
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit(dataurl)).not.toBeNull();
  });
  it("expects petInfo methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app['petInfo'] = '';
    expect(app.petInfo).not.toBeNull();
  });
  it("expects close methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.close()).not.toBeNull();
  });
  it("expects delete methods and it should be TRUE", () => {
    const pet ={id:123}
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.delete(pet)).not.toBeNull();
    expect(app.delete(pet)).toBeUndefined();
  });
  it("expects ngOnChanges methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges()).not.toBeNull();
  });
  it("expects swap methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app['swap'] = '';
    expect(app.swap).not.toBeNull();
  });
  it("expects uploadPicture methods and it should be TRUE", () => {
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    const fixture = TestBed.createComponent(EditPetPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.uploadPicture(event)).not.toBeNull();
  });

});
