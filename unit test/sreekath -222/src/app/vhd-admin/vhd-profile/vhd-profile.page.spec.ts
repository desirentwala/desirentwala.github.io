import { async, ComponentFixture, TestBed, tick, inject, fakeAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VhdProfilePage } from './vhd-profile.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
// import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpModule,
  XHRBackend,
  Response,
  ResponseOptions,
  RequestMethod
} from '@angular/http';

import { UserService } from '../../common/services/user.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { CommonService } from 'src/app/common/services/common.service';
import { IonicStorageModule } from '@ionic/storage';

describe('VhdProfilePage will render', () => {
  let component: VhdProfilePage;
  let fixture: ComponentFixture<VhdProfilePage>;
  let service: UserService;
  let mockBackend: MockBackend;
  let noti: NotificationService;
  let apiUrl: '';
  let common:CommonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VhdProfilePage ],
      imports: [FormsModule, HttpClientModule , RouterTestingModule, HttpModule, ReactiveFormsModule,
        HttpClientTestingModule , IonicModule.forRoot(),IonicStorageModule.forRoot()],
      providers: [
        Camera,
        CommonService,

        NotificationService,
        UserService,
        { provide: XHRBackend, useClass: MockBackend }

       
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VhdProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(UserService);
    mockBackend = TestBed.get(XHRBackend);
     noti=TestBed.get( NotificationService);
     common=TestBed.get(CommonService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });





  it('should get the list of products from the server', inject([UserService], fakeAsync ((service: UserService) => {
    const testProducts = [
      {

      },

    ];

    // Arrange
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toBe(apiUrl);
      tick(50);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: testProducts
          })
        )
      );
    });
    fixture.detectChanges();


    try {
      tick(50);

      let user = service.getUserList(3).subscribe((res) => {
          expect(res).not.toBeNull();
        });


  } catch (err) {


      }


  })));

  it('get user data',()=>
  {
      let result=component.getUserData();
      expect(result).not.toBeNull();

  })

  it("imageFilePathChange will render", () => {
    const fixture = TestBed.createComponent(VhdProfilePage);
    fixture.detectChanges();
    const blob=new Blob([]);
    blob['name']="test.xls";
    const event = { target: { files: [blob] }};
    //component.imageFilePathChange(event);
    expect(component.imageFilePathChange(event)).toBeUndefined();
  });

  it('edit profile enable',()=>{
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
      password: 'demo123',
    }

    const fixture = TestBed.createComponent(VhdProfilePage);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['vhdData'] = vetDetailsObj;
   // expect(comp.updateVhdProfile()).toBeUndefined();
    expect(comp.updateVhdProfile()).not.toBeNull();
  })



  it('get user details',()=>{
    let result=component.getUserDetails('data');
    expect(result).not.toBeNull();
  })


  it('edit profile enable',()=>{
    let result=component.editProfileEnable();
    expect(result).not.toBeNull();
  })


  it('take picture',()=>
  {
    let result=component.takePicture;
    expect(result).not.toBeNull();
  })

  it('select image',()=>
  {
    let result=component.selectImage();
    expect(result).not.toBeNull();
  })
 
  it("uploadPicture will render", () => {
    const blob1=new Blob([]);
    blob1['name']="test.xls";
    const event = { target: { files: [blob1] }};
    spyOn(component,'uploadPicture').and.callThrough()  
    expect(component.uploadPicture(event)).not.toBeNull();
  });

  it('should render image for desktop', async(() => {
  
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  }));



  it('upload picture',()=>
  {
let event:any;
    let upload=component.uploadPicture(event);

expect(upload).toBeUndefined();
});

it('uploadProfilePic',()=>
{
let picture:any;
let id:any;
let upload=component.uploadProfilePic(picture,id);
expect(upload).toBeUndefined();




});

it('notification service',()=>
{
  let notify=noti.notification('message','status');
  expect(notify).not.toBeNull();
})


it(' this.userService.updateVhdUser',()=>
{

  let data={

    id: 1,
    firstName:'alex',
    lastName:'robert',
    email: 'alex@gmail.com',
    mobile:'21202121212',
    password:'sjjs2J2@',
   
    isActive:true,
    practiceId: 2
  
  }
let ser=service.updateVhdUser(data).subscribe((res)=>
{
 expect(res).not.toBeNull();
})

})

it('setting up local storage',()=>
{

let data=[{
  id: 13,
  email: "rashmihebbar23@gmail.com",
  firstName: "Rashmi",
  mobile: "07272727277",
  password: "",
  practiceId: null,
  profilePic: "PO_13.png",
  isActive: 1
}]
  

  let local=localStorage.setItem('result', JSON.stringify(data));
expect(local).not.toBeNull();

})

it('check notification',()=>
{
expect(noti.notification('status','message')).not.toBeNull();



});

it('get storage not to be null',()=>
{

  expect(component.getUserData()).not.toBeNull();
    if (JSON.parse(localStorage.getItem('result')) !== null) {
    let loc=  component.getUserDetails(JSON.parse(localStorage.getItem('result')));
    expect(loc).not.toBeNull();
   // let res=component.getUserDetails(loc);
  //  expect(res).not.toBeNull();
    }

});



it('upload picture',()=>
{
let evt=event;
expect(component.uploadPicture(evt)).not.toBeNull();
  // uploadPicture(evt) {
    const files = evt;
   
    if(files){
    const totalBytes = files[0].size;
    const size = Math.floor(totalBytes / 4000000) + 'MB';
    if (size >= '1MB') {
      noti.notification('Profile picture should not exceed 4MB', 'danger');
    } else {
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) { }
      const reader = new FileReader();
      component.imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        component.currentImage = reader.result;
      };
      this.uploadProfilePic(files[0], this.vhdData.id);
    }}else{


    }
  



});




it('camera gallery',()=>{


let opt:CameraOptions;
  // const options: CameraOptions = {
  //   quality: 100,
   
  //   destinationType: component.camera.DestinationType.DATA_URL,
  //   encodingType: component.camera.EncodingType.JPEG,
  //   mediaType: component.camera.MediaType.PICTURE
  // };
 
    expect(component.camera.getPicture(opt)).not.toBeNull();

  

});


it(' dataURLtoFile',()=>
{
  let event:'event';
  expect(component.dataURLtoFile(event)).not.toBeNull();
});


it('profile pic',()=>{

  expect(common.picSubject.next({ data: 'pic' })).toBeUndefined();
  expect(component.updateStorage('pic')).toBeUndefined();
});


it(' takePicture(sourceType)',()=>{

expect(component.takePicture('source')).toBeUndefined();

})
});



