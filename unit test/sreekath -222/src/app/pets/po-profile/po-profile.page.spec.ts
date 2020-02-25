import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { PoProfilePage } from "./po-profile.page";
import { RouterTestingModule } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { MockUserService } from "../../common/services/mockUser.service";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NotificationService } from 'src/app/common/services/notification.service';
import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
import { MockBackend,MockConnection } from '@angular/http/testing';
import { CommonService } from 'src/app/common/services/common.service';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../po-profile/mockStorage';

describe("profileview for pet Journey", () => {
  let component: PoProfilePage;
  let fixture: ComponentFixture<PoProfilePage>;
  const Path = "../../../assets/profile-picture.png";
  let service:MockUserService
  let mockBackend: MockBackend;
  let data;
  let mockStorage = Storage;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoProfilePage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        IonicStorageModule.forRoot()
      ],
      providers:[MockUserService,
        {provide: Storage, useClass: MockStorage},
        Camera,
        NotificationService,
        {provide:XHRBackend,useClass:MockBackend},
        CommonService]
    }).compileComponents();
    mockBackend=TestBed.get(XHRBackend);
    fixture = TestBed.createComponent(PoProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
 
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should show a validation error if the first name was touched but left empty", () => {
    let component = fixture.componentInstance;
    component.userData = "firstName";
    component.userData = "email";
    component.userData = "mobile";
    fixture.detectChanges();
    let firstNameValidationError: DebugElement;
    fixture.detectChanges();
    firstNameValidationError = fixture.debugElement.query(
      By.css(".text-danger")
    );
    expect(firstNameValidationError).toBeNull();
    let emailValidationError: DebugElement;
    fixture.detectChanges();
    emailValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(emailValidationError).toBeNull();
    let mobileValidationError: DebugElement;
    fixture.detectChanges();
    mobileValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(mobileValidationError).toBeNull();
  });
  it("should show a validation error if the first name was touched", () => {
    let component = fixture.componentInstance;
    component.userData = "";
    component.userData = "";
    component.userData = "";
    fixture.detectChanges();
    let firstNameValidationError: DebugElement;
    fixture.detectChanges();
    firstNameValidationError = fixture.debugElement.query(
      By.css(".text-danger")
    );
    expect(firstNameValidationError).toBeNull();
    let emailValidationError: DebugElement;
    fixture.detectChanges();
    emailValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(emailValidationError).toBeNull();
    let mobileValidationError: DebugElement;
    fixture.detectChanges();
    mobileValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(mobileValidationError).toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture).toBeTruthy();
  });
  it("passsing sourceType As Param", () => {
    let sourceType: any;
    let imageData:any
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).toBeUndefined();
    component.currentImage = 'data:image/jpeg;base64,' + imageData;
  });
  it("expects method should be fetch the Localstorage Data", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getUserData).toBeTruthy();
  });
  it("expects method should be fetch the userdetails from userService", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getUserDetails).toBeTruthy();
  });
  it("expects method should be fetch the userdetails from userService", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getUserDetails).not.toBeNull();
  });
  it("expects method should be fetch the userdetails from userService", () => {
    data = 3;
    expect(component.getUserDetails(5)).toBeUndefined();
  });
 
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage).toBeTruthy();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
   // const event = { target: { value: 42 }};
    component.imageFilePathChange(event);
   
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const event = { target: { value: 0 }};
    component.imageFilePathChange(event);
    app.file = event.target.value;
    app.reader = new FileReader();
  });
  it("image upload method for desktop only", () => {
    const event = new KeyboardEvent("keypress",{
      "key": "Enter"
  });
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.imageFilePathChange).toBeTruthy();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadPicture).toBeTruthy();
  });
  it("expects method should be uploadPicture and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event1 = { target: { files: [blob1] }};
    component.uploadPicture(event1);
    component=fixture.componentInstance;
    spyOn(component,'uploadPicture').and.callThrough()  
    expect(component.notify.notification).toBe('Profile picture should not exceed 4MB ', 'danger');
     //const blob=new Blob([]);
   //  blob['name']="test.xls";
    // blob['lastModifiedDate']=new Date();
    //  const event ={srcElement:{files:[blob]}
    //  }
    // component.uploadPicture(event)
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.updateProfile).toBeTruthy();
  });
  it("expects method should be intialized and it should be TRUE", () => {
   
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.user ={}
    app.isNameChanged = false;
      app.readFormValue = true;
      app.profDetails = 'username';
      localStorage.setItem('result', JSON.stringify(app.profDetails));
      app.commonService.picSubject.next({ user: app.user.data });
      app.notify.notification('Profile details updated successfully');
 
    component.updateProfile
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editProfileEnable).toBeTruthy();
  });
  it("expects uploadProfilePic methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic).toBeTruthy();
  });
  it("expects uploadProfilePic methods and it should be TRUE", () => {
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic).not.toBeNull();
  });
  it("expects uploadProfilePic methods and it should be TRUE", () => {
  //  const store = { 'profilePic': 234} 
   // const pic = store.profilePic;
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    //app.uploadProfilePic(profilePic,id)
    expect(app.updateStorage).not.toBeNull();
  });
  it("expects method should not pass param", () => {
    let data:any
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.editProfileEnable(data)).toBeUndefined();
  });
  it("expects method should be intialized and it should be TRUE", () => {
   // let image = service.updateUser();
    const fixture = TestBed.createComponent(PoProfilePage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
  //  expect(app.updateProfile(image)).toBeUndefined();
  });
  let petPicUpdate: Event;
  let profilePic: any;
  it("can be initialized", () => {
    expect(fixture).toBeDefined();
    expect(PoProfilePage).toBeDefined();
    expect(petPicUpdate).toBeUndefined();
  });

  it("can set pet profile uploader if image is empty", () => {
    profilePic = {
      target: {
        reader: FileReader,
        imagePath: Path
      }
    };
    expect(profilePic.reader).toBeUndefined(Path);
  });
  it("should call Click Editmethod and updateMethod", () => {
    const editProfileEnable = spyOn(component, "editProfileEnable");
    // const updateProfile     = spyOn(component, 'editProfileEnable');
    fixture.debugElement
      .query(By.css("ion-button"))
      .triggerEventHandler("click", null);
    expect(editProfileEnable).toHaveBeenCalled();
    //expect(updateProfile).toHaveBeenCalled();
  });

  // it('should render the image for mobile', async(() => {
  //   const fixture = TestBed.createComponent(PoProfilePage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.col-12>img').src).toContain('http://localhost:9876/assets/imgs/mobile-logo.png');
  // }));
  it('should create a FormGroup comprised of FormControls', () => {
    expect(component.readFormValue).toBe(true);
    expect(component.readFormValue).not.toBe(false);
    expect(component.isNameChanged).toBe(undefined);
});



it('profile upload',()=>{

  let evt={target: { value: 100}}
  expect(component.dataURLtoFile(evt)).toBeUndefined();

expect(component.uploadPicture(evt)).toBeUndefined();
expect(component.uploadProfilePic(evt,1)).toBeUndefined();

expect(component.updateStorage(evt)).toBeUndefined();
});

it('upadate profile',()=>
{

  expect(component.updateProfile()).toBeUndefined();
    expect(component.data.type).toBe('PO');
    // this.userService.updateUser(this.data).subscribe((user: any) => {
    //   this.isNameChanged = false;
    //   this.readFormValue = true;
    //   const profDetails = this.commonService.getStorage;
    //   profDetails.firstName = user.data.firstName;
    //   localStorage.setItem('result', JSON.stringify(profDetails));
    //   this.commonService.picSubject.next({ user: user.data });
    //   this.notify.notification('Profile details updated successfully', 'success');
    // });
  








})
});
