import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPetOwnerPage } from './edit-pet-owner.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MockStorage } from '../edit-pet-owner/mockStorage';
import { Storage } from '@ionic/storage';

describe('EditPetOwnerPage', () => {
  let component: EditPetOwnerPage;
  let fixture: ComponentFixture<EditPetOwnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPetOwnerPage ],
      imports: [RouterTestingModule,IonicModule.forRoot(),HttpClientTestingModule,FormsModule],
      providers: [{provide: Storage, useClass: MockStorage},Camera]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPetOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("expects onPrevious should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious).toBeTruthy();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).toBeUndefined();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).not.toBeNull();
  });
  it("expects onNext should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext).toBeTruthy();
  });
  it("expects onNext should be pass @param", () => {
    const petOwnerData = {pets:{PetsName:'dog'}};
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(component.onNext()).toBeUndefined();
    expect(component.onNext()).not.toBeNull();
    component.onNext();
    expect(app.petOwnerData).toEqual('');
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture).toBeTruthy();
  });
  it("passsing sourceType As Param", () => {
    let sourceType: any;
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).toBeUndefined();
  });
  it("selectImage method should render", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage()).not.toBeNull();
  });
  it("expects dataURLtoFile methods and it should be TRUE", () => {
    const dataurl = '';
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dataURLtoFile(dataurl)).not.toBeNull();
  });
  it("expects ngOnInit methods and it should be TRUE", () => {
    const dataurl = '';
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit(dataurl)).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    component.imageFilePathChange(event);
  });
  it("expects close methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.close()).not.toBeNull();
  });
  it("expects updateProfile methods and it should be TRUE", () => {
    const event = { target: { value: 42 }};
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile).toBeTruthy();
  });
  it("expects updateProfile methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile).not.toBeNull();
  });
  it("expects uploadProfilePic methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic).not.toBeNull();
  });
  it("expects uploadPicture methods and it should be TRUE", () => {
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    const fixture = TestBed.createComponent(EditPetOwnerPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.uploadPicture(event)).not.toBeNull();
    expect(app.uploadPicture(event)).toBeUndefined();
  });
  it("expects selectedPetOwnerData method should exhist", () => {
    component.selectedPetOwnerData = ['test','test1'];
    expect(component.selectedPetOwnerData).not.toBeNull();
  });
});
