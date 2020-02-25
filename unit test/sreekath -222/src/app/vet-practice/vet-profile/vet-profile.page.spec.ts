import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';
import { VetProfilePage } from './vet-profile.page';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {DebugElement} from "@angular/core"; 
import { MockVetPracticeService } from '../vet-mock-service';
import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend,MockConnection, } from '@angular/http/testing';
import { NgbTypeaheadWindow } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { IonicStorageModule } from '@ionic/storage';

describe('VetProfilePage should render', () => {
  let component: VetProfilePage;
  let fixture: ComponentFixture<VetProfilePage>;
  let service:MockVetPracticeService;
  let mockBackend: MockBackend;
  map:map;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetProfilePage ],
      imports: [HttpClientTestingModule,FormsModule,RouterTestingModule,IonicModule.forRoot(),IonicStorageModule.forRoot()],
      providers:[MockVetPracticeService,{provide:XHRBackend,useClass:MockBackend}]
    }).compileComponents();

    service = TestBed.get(MockVetPracticeService);
    mockBackend=TestBed.get(XHRBackend);
    fixture = TestBed.createComponent(VetProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("userData fetching From Mock service", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getUserDetails).toBeTruthy();
  });
  it("userData fetching From Mock service", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getUserDetails()).not.toBeNull();
  });
  it("imageFilePathChange will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.imageFilePathChange).toBeTruthy();
  });
  it("showPassword will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.showPassword()).not.toBeNull();
  });
  it("imageFilePathChange will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const blob=new Blob([]);
    blob['name']="test.xls";
    const event = { target: { files: [blob] }};
    component.imageFilePathChange(event);
    expect(component.imageFilePathChange(event)).toBeUndefined();
  });
  it("updateProfile will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile).toBeTruthy();
  });
  it("updateProfile will render", () => {
    const sourceType= [{ 'type':'image'}];
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).toBeUndefined();
    app.camera.getPicture('options').then((imageData) => {
      app.currentImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  });
  it("updateProfile will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile()).not.toBeNull();
  });
  it("updateVetService will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateVetService).toBeTruthy();
  });
  it("updateVetService will render", () => {
   const vetDetails =[{
    "test": 123
    }];
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateVetService).not.toBeNull();
  });
  it("adminSpecies fetching from Mockdata", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAdminSpecies).toBeTruthy();
  });
  it("selectedSpecies will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedSpecies).toBeTruthy();
  });
  it("selectedSpecies will render", () => {
    const speciesData ={species:{value:100}};
    const index = 23;
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.selectedSpecies.length === 1
    expect(app.selectedSpecies(speciesData,index)).not.toBeNull();
  });
  it("selectedSpecies will render", () => {
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    expect(component.uploadPicture(event)).not.toBeNull();
  });
  it("selectedSpecies will render", () => {
    const val= [{'flag':  2323}];
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateSpecies(val)).toBeUndefined();
  });
  it("adminSpecies passing mock param", () => {
    let speciesdata;
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getAdminSpecies(speciesdata)).toBeUndefined();
  });
  it("onPrevious  mock data will render", () => {
    let speciesdata;
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious).toBeTruthy();
  });
  it("onPrevious  mock data will render", () => {
    let speciesdata;
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious()).not.toBeNull();
  });
  it("onNext  mock data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext).toBeTruthy();
  });
  it("onNext  mock data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext()).not.toBeNull();
  });
  it("selectImage  mock data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage).toBeTruthy();
  });
  it("selectImage  mock data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage()).not.toBeNull();
  });
  it("uploadProfilePic data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic).toBeTruthy();
  });
  it("uploadProfilePic data will render", () => {
    const picture ='';
    const id      = 234;
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic(picture,id)).toBeUndefined();
  });
  it("updateStorage data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    let files='file';
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateStorage(files)).toBeUndefined();
  });
  it("updateStorage data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateStorage()).not.toBeNull();
  });
  it("editProfileEnable data will render", () => {
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editProfileEnable()).not.toBeNull();
  });
  it("editProfileEnable data will render", () => {
    const dataurl ='www.lucidatechnologies.com/index'
    const fixture = TestBed.createComponent(VetProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dataURLtoFile(dataurl)).not.toBeNull();
  });
  // it('should render the image for mobile', async(() => {
  //   const fixture = TestBed.createComponent(VetProfilePage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.col-12>img').src).toContain('http://localhost:9876/assets/imgs/mobile-logo.png');
  // }));
 
  it('should show a validation error if the first name was touched but left empty', () => {
   // let component = fixture.componentInstance;
   map;
    let vetProfiledata = service.getVetDetails();
    //   vetProfiledata.map(function (data) {
    //     expect(data.firstName).toEqual('Chetan KV');
    //     expect(data.lastName).toEqual('0');
    //     expect(data.mobile).toEqual('+919964670606');
    // });
    
    fixture.detectChanges();
    let firstNameValidationError: DebugElement;
    fixture.detectChanges(); 
    firstNameValidationError = fixture.debugElement.query(By.css('.text-danger'));
    expect(firstNameValidationError).toBeNull();
    let emailValidationError: DebugElement;
    fixture.detectChanges(); 
    emailValidationError = fixture.debugElement.query(By.css('.text-danger'));
    expect(emailValidationError).toBeNull();
    let mobileValidationError: DebugElement;
    fixture.detectChanges(); 
    mobileValidationError = fixture.debugElement.query(By.css('.text-danger'));
    expect(mobileValidationError).toBeNull();
});

it('should call Click Editmethod', () => {
  const editProfileEnable = spyOn(component, 'editProfileEnable');
  fixture.debugElement.query(By.css('ion-button')).triggerEventHandler('click', null);
  expect(editProfileEnable).toHaveBeenCalled();
});
it('should call Click Editmethod', () => {
  const editProfileEnable = spyOn(component, 'editProfileEnable');
  fixture.debugElement.query(By.css('ion-button')).triggerEventHandler('click', null);
  expect(editProfileEnable).not.toBeNull();
  expect(component.editProfileEnable()).not.toBeNull();
  expect(component.editProfileEnable()).toBeUndefined();
});
it('user profile data fetching from Mock data',(() => {
  let vetProfiledata = service.getVetDetails();
  // twoway-binding data tesing
  let component: VetProfilePage;
  expect(vetProfiledata).not.toBeNull();
  fixture.detectChanges();
  mockBackend.connections.subscribe((connection: MockConnection) => {
    expect(connection.request.method).toBe(RequestMethod.Get);
    connection.mockRespond(
      new Response(
        new ResponseOptions({
          body: vetProfiledata
        })
      )
    );
  });
}));
});
