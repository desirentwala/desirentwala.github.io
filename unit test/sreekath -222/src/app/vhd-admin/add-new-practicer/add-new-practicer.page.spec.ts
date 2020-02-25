import { async, ComponentFixture, tick, inject, fakeAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { AddNewPracticerPage } from './add-new-practicer.page';
import { FormsModule , NgForm} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VhdAdminService } from '../vhd-admin.service';
import {
    HttpModule,
    XHRBackend,
    Response,
    ResponseOptions,
    RequestMethod
  } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { NotificationService } from 'src/app/common/services/notification.service';
import { CommonService } from 'src/app/common/services/common.service';
import { DebugElement } from '@angular/core';
import {Component} from '@angular/core'; 
import { By } from '@angular/platform-browser';
import { CameraOptions } from '@ionic-native/camera/ngx';
describe('AddNewPracticerPage', () => {
  let component: AddNewPracticerPage;
  let fixture: ComponentFixture<AddNewPracticerPage>;
  let vhdservice: VhdAdminService;
  let mockBackend: MockBackend;
  let noti:NotificationService;
  let commonser:CommonService;
  let directiveElement: DebugElement;
  let setevent;
  const apiUrl = '';
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPracticerPage ],
      providers: [VhdAdminService,NotificationService, CommonService , { provide: XHRBackend, useClass: MockBackend }],
      imports: [FormsModule, HttpClientModule ,
        HttpClientTestingModule, RouterTestingModule, HttpModule, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewPracticerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directiveElement = fixture.debugElement.query(By.css('#file-input'));
     noti=TestBed.get(NotificationService);
     commonser=TestBed.get(CommonService);
    vhdservice = TestBed.get(VhdAdminService);
    mockBackend = TestBed.get(XHRBackend);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('practiceName field validity', () => {

    const practiceName = component.addPractice.controls.practiceName;
    if (practiceName != undefined) {
    expect(practiceName.valid).toBeFalsy();
    }
    if (practiceName != undefined) {
    practiceName.setValue('');
    expect(practiceName.hasError('required')).toBeTruthy();
}

  });

  it('groupName field validity', () => {
    const groupName = component.addPractice.controls.groupName;
    if ( groupName != undefined) {
    expect(groupName.valid).toBeFalsy();
    }
    if ( groupName != undefined) {
    groupName.setValue('');
    expect(groupName.hasError('required')).toBeTruthy();
}


  });

  it('phoneNum field validity', () => {
    const phoneNum = component.addPractice.controls.phoneNum;
    if (phoneNum != undefined) {
    expect(phoneNum.valid).toBeFalsy();
}
    if (phoneNum != undefined) {
 phoneNum.setValue('');
 expect(phoneNum.hasError('required')).toBeTruthy();

}

  });
  it('email field validity', () => {

    const email = component.addPractice.controls.email;
    if (email != undefined) {
    expect(email.valid).toBeFalsy();
}
    if (email != undefined) {
    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();
}

  });
  it('website field validity', () => {
    const email = component.ngForm.controls.website;
    if (email != undefined) {
    expect(email.valid).toBeFalsy();
  }
    if (email != undefined) {
    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();
    }
  });
  it('address2 field validity', () => {
    const address2 = component.addPractice.controls.address2;
    if (address2 != undefined) {
        expect(address2.valid).toBeFalsy();
    }
    if (address2 != undefined) {
        address2.setValue('');
        expect(address2.hasError('required')).toBeTruthy();

    }

  });


  it('  address1 field validity', () => {
    const address1 = component.addPractice.controls.address1;
    if (address1 != undefined) {
        expect(address1.valid).toBeFalsy();
    }

    if (address1!= undefined) {
        address1.setValue('');
        expect(address1.hasError('required')).toBeTruthy();
    }
  });
  it('  postCode field validity', () => {
    const  postCode  = component.ngForm.controls.postCode;
    if(postCode!=undefined)
    {
        expect( postCode .valid).toBeFalsy();
    }
  
    if(postCode!=undefined)
    {
    postCode .setValue('');
    expect( postCode .hasError('required')).toBeTruthy();
    }

  });




  it(' city field validity', () => {
    const  userCountryCode = component.addPractice.controls.country;
    if( userCountryCode!=undefined)
    {
        expect( userCountryCode.valid).toBeFalsy();
    }
    
    if( userCountryCode!=undefined)
    {
    userCountryCode.setValue('');
    expect( userCountryCode.hasError('required')).toBeTruthy();
    }

  });


  it('form  new pa should be valid', () => {

  const  postCode  = component.ngForm.controls.postCode;
 const  email  = component.ngForm.controls.email;
  const  address1  = component.ngForm.controls.address1;
  const practiceName=component.ngForm.controls.practiceName;
  const country=component.ngForm.controls.country;
  const phoneNum=component.ngForm.controls.phoneNum;

  if(email!=undefined && postCode!=undefined && address1!=undefined && phoneNum!=undefined
    
    && practiceName!=undefined
    )
    {
      component.ngForm.controls['email'].setValue('admin@gmail.com');
      component.ngForm.controls['phoneNum'].setValue('01234567891');
      component.ngForm.controls['address1'].setValue('uk');
      component.ngForm.controls['postCode'].setValue('GIR 0AA');
      component.ngForm.controls['practiceName'].setValue('manoj');
      component.ngForm.controls['country'].setValue('london');
      expect(component.addPractice.valid).toBeTruthy();
    }


  
});

  it(' contactPhoneNo field validity', () => {
    const contactPhoneNo = component.addPractice.controls.contactPhoneNo;
    if( contactPhoneNo!=undefined)
    {
        expect(contactPhoneNo.valid).toBeFalsy();

    }
    if( contactPhoneNo!=undefined)
    {
    contactPhoneNo.setValue('');
    expect(contactPhoneNo.hasError('required')).toBeTruthy();
    }
  });


  it('should get the list of species from the server', inject([VhdAdminService], fakeAsync (( vhdservice: VhdAdminService) => {
  let testdata: [

{id: 1, speciesName: 'Dog', iconName: 'fal fa-dog', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
 , {id: 2, speciesName: 'Cat', iconName: 'fal fa-cat', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 3, speciesName: 'Rabbit', iconName: 'fal fa-rabbit', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 4, speciesName: 'Bird', iconName: 'fal fa-duck', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 5, speciesName: 'Farming', iconName: 'fal fa-sheep', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 6, speciesName: 'Small mammals', iconName: 'fal fa-turtle', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 7, speciesName: 'Reptiles', iconName: 'fal fa-snake', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 8, speciesName: 'Horse', iconName: 'fal fa-horse', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 9, speciesName: 'Farm', iconName: 'fal fa-cow', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
, {id: 10, speciesName: 'Other', iconName: 'fal fa-otter', createdOn: '2019-12-24T14:25:43.000Z', updatedOn: null}
  ];



    // Arrange
  mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toBe(apiUrl);
      tick(50);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
          body: testdata,
          })
        )
      );
    });



  fixture.detectChanges();


  try {
      tick(50);
      const species =  vhdservice.getSpecies();
    //    service.getSpecies().subscribe((res) => {
    //       expect(res).toEqual(testdata);
    //     });
      species.subscribe((res) => {
    expect(res).toContain(testdata);
});

  } catch (err) {

          expect(err).toContain('error');
      }


  })));




  it('post the products to the server', inject([VhdAdminService], fakeAsync (( vhdservice: VhdAdminService) => {
    const testProducts = [
      {
        practiceName: 'demo123',
        groupName: 'demo',
        countryCode: '+91',
        phoneNo: '+9111212121212',
        email: 'demo123@gmail.com',
        website: 'demo.co',
        address1: 'demo',
        address2: 'demo',
        country: 'demo',
        postCode: '1111111',
        contactFullName: 'demo',
        contactEmail: 'demo123@gmail.com',
        userCountryCode: '+91',
        contactPhoneNo: '+9112121212121',
        species: [{
            id: 1,
            speciesName: 'Dog',
            iconName: 'fal fa-dog',
            createdOn: '2019-12-24T14:25:43.000Z',
            updatedOn: null,
            isActive: true
        }]
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


      const user = vhdservice.addNewPractice(testProducts);
      user.subscribe((res) => {
        expect(res).not.toBeNull();
    });


  } catch (err) {

          expect(err).toContain('error');
      }


  })));


  it('ngOnit', () => {
    const onit = component.ngOnInit();
    expect(onit).not.toBeNull();
});


//   it('create pratice', () => {
//     const onit = component.createPractice();
//     expect(onit).toBeTruthy();
// });



  it('invite pratice', () => {
    const onit = component.invitePractice();
    expect(onit).not.toBeNull();
});


  it('Add Invite', () => {
    const onit = component.onAddOrInvite('data');
    expect(onit).not.toBeNull();
});

  it('upload profile pic', () => {
    const onit = component.uploadProfilePic;
    expect(onit).not.toBeUndefined();
});



  it('selected species', () => {
    const onit = component.selectedSpecies('species', 'data');
    expect(onit).not.toBeNull();
});


  it('onprevious', () => {
    const onit = component.onPrevious();
    expect(onit).not.toBeNull();
});
  it('onnext', () => {
    const onit = component.onNext();
    expect(onit).not.toBeNull();
});


  

  it('selectimage', () => {
    const onit = component.selectImage();
    expect(onit).not.toBeNull();
});


  it('pet pic update', () => {

    const onit = component.petPicUpdate;
    expect(onit).not.toBeUndefined();

});

it('take picture',()=>
{
  let sourceType= {target:{value : 100}};
expect(component.takePicture(sourceType)).toBeUndefined();
})





//   it('should render bookings title', () => {

//   const compiled = fixture.debugElement.nativeElement;
//   expect(compiled.querySelector('h3').textContent).toBeNull();
// });




it('petPicUpdate method will render',()=>
{
  const blob1=new Blob([]);
  blob1['name']="test.xls";
  const event = { target: { files: [blob1] }};
  let comp=component.petPicUpdate(event);
  expect(comp).toBeUndefined();
});



it('pratice model',()=>
{
  let mod=component.practiceModel;
  mod.practiceName='alex';
  mod.tag= 'vet';
  mod.phoneNo='012222222222';
  mod.email='manoj@gmail.com';
  mod.website='www.web.com';
  mod.address1='uk';
  mod.address2='ss';
  mod.country='uk';
  mod.postCode=2121222;
  mod.contactFullName='alex alex';
  mod.contactPhoneNo='121212121221';
  mod.contactEmail='mn@gmail.com';
  mod.practiceEmail='mm@gmail.com';
  mod.invitePracticeName='robert';

  expect(mod).toBeDefined();
expect(mod).not.toBeNull();





})


it('sepcies length ',()=>
{
  expect(component.initialImages).toBe(7);
  expect(component.initialImages).not.toBeNull();
  expect(component.colSize).toBe(1.5);
  expect(component.colSize).not.toBeNull();
  expect(component.colNavSize).toBe(0.7);
  expect(component.colNavSize).not.toBeNull();


 expect(component.from).toBe(0);
})

it('notifaction service',()=>
{
  let comp=noti.notification('message','status');
  expect(comp).toBeDefined();
})




it(' dataURLtoFile',()=>
{
  let dataurl:any;
  let comp=component.dataURLtoFile(dataurl);
  expect(comp).toBeUndefined();

});

it(' invitePractice',fakeAsync(()=>
{
  // let comp=component.invitePractice();
  // expect(comp).not.toBeUndefined();
let data=
{
  mlFor: 'INVITE_PA',
  userId:1,
  practiceName: 'alex',
  email:'demo@gmail.com'
}
tick(50);
let ser=vhdservice.invitePractic(data).subscribe((res)=>
{
  expect(res).not.toBeNull();
});



}));

it('localstorage mock data',()=>
{ 
  let idd: 5;
  let email: "rashmi.hebbar@agkiya.cloud";
  let firstName: "Manipal";
  let mobile: "0727272772";
  let password: "";
  let practiceId: 3;
  let profilePic: "PA_5.png";
  let isActive: 1;
 
})
it('selectedSpecies',()=>{
let compo=component.selectedSpecies(12,'1');
expect(compo).toBeUndefined();
if (component.selectedSpecies.length < 0) {
  expect(component.isSpeciesSelected).toBe(false);
}
if (component.selectedSpecies.length !== 0) {
  expect(component.isSpeciesSelected).toBe(true);
  let selectedSpeciess=[{id:1}]
  let presentID = selectedSpeciess.findIndex((species) => {
    return 12 === species.id;
  
  });
  expect(presentID).not.toBeNull();
  
}else
{

}
});


it('platform',()=>
{
  if (component.platform.is('ipad')) {
    expect(component.initialImages).toBe(4);
    expect(component.colSize).toBe(2.5);
    expect(component.colNavSize).toBe(1);
  }
  if ((component.platform.height() >= 1024 && component.platform.width() >= 1366 && component.platform.is('ipad')) ||
    (component.platform.height() >= 1366 && component.platform.width() >= 1024 && component.platform.is('ipad'))) {
    expect(component.initialImages).toBe(5);
    expect(component.colSize).toBe(2);
    expect(component.colNavSize).toBe(1);
  }

});
it('camera',()=>{

  let options: CameraOptions;
let comp=component.camera.getPicture(options);
expect(comp).not.toBeNull();
});


it('navigator',()=>{
 
  if (navigator.userAgent.match(/Android/i)!=undefined 

) {
 expect(component.isMobile).toBe(true);
} else {
  expect(component.isMobile).toBe(false);
}
if (component.platform.is('mobileweb')) {
  expect(component.isMobile).toBe(false);
}
})

it('onprevious',()=>{
  expect(component.onPrevious()).not.toBeNull();
  if (component.from !== 0) {
    component.speciesArray = component.speciesList.slice(component.from - 1, component.initialImages - 1);
    component.from -= 1;
    expect(component.initialImages).toBe(7);

    component.activeIndex += 1;
  }
})



it('onnext',()=>{
expect(component.onNext()).not.toBeNull();
  if (component.initialImages < component.speciesList.length) {
    component.speciesArray =component.speciesList.slice(component.from + 1, component.initialImages + 1);
  expect(component.from).toBe(1);
    expect(component.initialImages).toBe(1);
    expect(component.activeIndex).toBe(1);
  }
})
it('take pictures',()=>
{
  expect(component.takePicture('source')).not.toBeNull();
})
it('getSpeciesList',()=>{
  expect(component.getSpeciesList()).toBeUndefined();
})
it('vhd admin service',()=>{
    let data = { 
    species:'cat',
    email:'alex@gmail.com'
  };
let con=component.vhdAdminService.practiceCheck(data).subscribe((res)=>{
  expect(res).not.toBeNull();
})
let comp=component.vhdAdminService.addNewPractice(data).subscribe((res)=>{
expect(res).not.toBeNull();
})
let ser= component.vhdAdminService.invitePractic(data).subscribe((res)=>{
  expect(res).not.toBeNull();
})
});
it('createPractice',()=>{
  let evt:any;
  expect(component.createPractice()).toBeUndefined();
})
it('assigning values',()=>{
  expect(component.isMobile).not.toBeNull();
  expect(component.initialImages).not.toBeNull();
 expect(component.colSize).not.toBeNull();
  expect(component.colNavSize).not.toBeNull();

});

});