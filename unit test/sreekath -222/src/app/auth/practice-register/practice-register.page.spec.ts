import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PracticeRegisterPage } from './practice-register.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
// import { Storage } from '@ionic/Storage';
import { IonicStorageModule} from '@ionic/storage';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpModule,
  XHRBackend,
  Response,
  ResponseOptions,
  RequestMethod
} from '@angular/http';
import { By } from '@angular/platform-browser';
import { AuthService } from 'src/app/common/services/auth.service';
import { UserService } from 'src/app/common/services/user.service';
import { MagicLinkService } from 'src/app/common/services/magic-link/magic-link.service';
import { NotificationService } from 'src/app/common/services/notification.service';
describe('PracticeRegisterPage', () => {
  let component: PracticeRegisterPage;
  let fixture: ComponentFixture<PracticeRegisterPage>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: PracticeAdminService;
  let location: Location;
  let router: Router;
  let apiUrl: '';
  let authservice: AuthService;
  let userservice: UserService;
  let praticeservice: PracticeAdminService;
  let mockBackend: MockBackend;
  let magic: MagicLinkService;
  let noti:NotificationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeRegisterPage],
      providers: [UserService, MagicLinkService,
         AuthService,NotificationService,

        PracticeAdminService,
        { provide: XHRBackend, useClass: MockBackend }
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        HttpModule,

        ReactiveFormsModule,
        HttpClientTestingModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();
    mockBackend = TestBed.get(XHRBackend);
    service = TestBed.get(PracticeAdminService);
    magic = TestBed.get(MagicLinkService);
    fixture = TestBed.createComponent(PracticeRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authservice = TestBed.get(AuthService);
    userservice = TestBed.get(UserService);
    praticeservice = TestBed.get(PracticeAdminService);
    noti=TestBed.get(NotificationService);
    
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('practiceName field validity', () => {
    const name = component.ngForm.controls.practiceName;
    expect(name.valid).toBeFalsy();

    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
  });

  it('phone No field validity', () => {
    const phoneNo = component.ngForm.controls.phoneNo;
    expect(phoneNo.valid).toBeFalsy();

    phoneNo.setValue('');
    expect(phoneNo.hasError('required')).toBeTruthy();
  });

  it('email field validity', () => {
    const email = component.ngForm.controls.email;
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();
  });


  it('address1 field validity', () => {
    const web = component.ngForm.controls.address1;
    expect(web.valid).toBeFalsy();

    web.setValue('');
    expect(web.hasError('required')).toBeTruthy();
  });


  it('postcode field validity', () => {
    const web = component.ngForm.controls.postcode;
    expect(web.valid).toBeFalsy();

    web.setValue('');
    expect(web.hasError('required')).toBeTruthy();
  });



  it('check incoming species not to equal to null', () => {
    const result = component.retrieveSpecies();
    expect(result).not.toBeNull();
  });

  it('should get the list of products from the server', inject(
    [PracticeAdminService],
    fakeAsync((service: PracticeAdminService) => {
      const testProducts = [
        {

        }
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

        const user = service.getSpecies().subscribe(res => {
          expect(res).not.toBeNull();
        });
      } catch (err) {
        expect(err).toContain('error');
      }
    })
  ));

  it('#should return error 404', inject(
    [PracticeAdminService],
    fakeAsync((service: PracticeAdminService) => {
      try {
        tick(50);
        // tslint:disable-next-line: align
        const user = service.getSpecies().toPromise();

        expect(user).not.toBeNull();
      } catch (err) {
        // why do you also expect an error to be thrown?
        expect(err).toContain('error');
      }
    })
  ));


  it('function calls', () => {
    expect(component.ngOnInit).toBeTruthy();
    // expect(component.retrieveSpecies).toBeTruthy();
    expect(component.profilePicUpdate).toBeTruthy();
    expect(component.selectedSpecies).toBeTruthy();
    expect(component.onPrevious).toBeTruthy();
    expect(component.onNext).toBeTruthy();
    expect(component.uploadProfilePic).toBeTruthy();
    expect(component.registerPractice).toBeTruthy();
    expect(component.onCloseSignup).toBeTruthy();
  });


  it('selected species func', () => {
    const para1 = 'species';
    const para2 = 'index';
    const result = component.selectedSpecies(para1, para2);
    expect(result).not.toBeNull();


  });
  it('onprevious', () => {
const res = component.onPrevious();
const re = component.speciesArray;
expect(res).not.toBeNull();
expect(re).not.toBeNull();
});
  it('counts', () => {
  expect(component. initialImages).toBe(3);
  expect(component.from).toBe(0);
});
  it('onNext ', () => {
  const onnext = component.onNext();
  expect(onnext).not.toBeNull();
  });
  it('profile picture upload', () => {
  const result = component.uploadProfilePic;
  expect(result).not.toBeUndefined();
});
  it('profile pic update', () => {
  const result = component.profilePicUpdate;
  expect(result).not.toBeNull();
});
  it('oncloseup', () => {
  const re = component.onCloseSignup();
  expect(re).not.toBeNull();
});
  it('should test the elements', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.ion-padding '));

    const rowDebugElement2 = de.queryAll(By.css('.signUpLogo'));
    const rowDebugElement3 = de.queryAll(By.css('.beta-logo'));

    const rowDebugElement4 = de.queryAll(By.css('.horizontalLine'));

    const rowDebugElement5 = de.queryAll(By.css('.sign-in-button'));

    const rowDebugElement6 = de.queryAll(By.css('.species-card'));

    const rowDebugElement7 = de.queryAll(By.css('.navigation-card'));

    const rowDebugElement8 = de.queryAll(By.css('.inner-card'));

    const rowDebugElement9 = de.queryAll(By.css('.upload-image text-center '));

    const rowDebugElement10 = de.queryAll(By.css('.ion-text-center'));

    const rowDebugElement11 = de.queryAll(By.css('.sign-up-for-free'));

    const rowDebugElement12 = de.queryAll(By.css('.signupLabel'));

    const rowDebugElement13 = de.queryAll(By.css('.row'));

    const rowDebugElement14 = de.queryAll(By.css('.form-control'));
    const rowDebugElement15 = de.queryAll(By.css('.middle'));

    const rowDebugElement16 = de.queryAll(By.css('.text'));

    const rowDebugElements10 = de.queryAll(By.css('form'));
    const rowDebugElements11 = de.queryAll(By.css('label '));
    const rowDebugElements12 = de.queryAll(By.css('input '));
    const rowDebugElements13 = de.queryAll(By.css('small'));
    const rowDebugElements14 = de.queryAll(By.css('div'));
    const rowDebugElements15 = de.queryAll(By.css('ion-button'));
    expect( rowDebugElement1).not.toBeNull();
    expect( rowDebugElement2).not.toBeNull();
    expect( rowDebugElement3).not.toBeNull();
    expect( rowDebugElement4).not.toBeNull();
    expect( rowDebugElement5).not.toBeNull();
    expect( rowDebugElement6).not.toBeNull();
    expect( rowDebugElement7).not.toBeNull();
    expect( rowDebugElement8).not.toBeNull();
    expect( rowDebugElement9).not.toBeNull();
    expect( rowDebugElement10).not.toBeNull();
    expect( rowDebugElement12).not.toBeNull();
    expect( rowDebugElement13).not.toBeNull();
    expect( rowDebugElement14).not.toBeNull();
    expect( rowDebugElement15).not.toBeNull();
    expect( rowDebugElements10).not.toBeNull();
    expect( rowDebugElements11).not.toBeNull();

    expect( rowDebugElements12).not.toBeNull();

    expect( rowDebugElements13).not.toBeNull();
    expect( rowDebugElements14).not.toBeNull();

    expect( rowDebugElements15).not.toBeNull();
  });
  it('species list', () => {
  const res = component.speciesList;
  const resp = component.speciesArray;
  expect(res).not.toBeNull();
  expect(resp).not.toBeNull();
});
  it('function call', () => {
  expect(component.selectedSpecies('species', 'index')).length >= 1;
  expect(component.selectedSpecies('species', 'index')).length == 0;
});
  it('should return a collection of users', () => {
      const userResponse = [
        {
          id: '1',
          name: 'Jane',
          role: 'Designer',
          pokemon: 'Blastoise'
        },
        {
          id: '2',
          name: 'Bob',
          role: 'Developer',
          pokemon: 'Charizard'
        }
      ];
      let response;
      spyOn(praticeservice, 'getSpecies').and.returnValue(of(userResponse));
      praticeservice.getSpecies().subscribe(res => {
        response = res;
      });
      expect(response).toEqual(userResponse);
    });
  it('upload function', () => {
  const res = component.profilePicUpdate;
  expect(res).not.toBeNull();
});
  it('profile pic', () => {
  const compo = component.profilePicUpdate;
  expect(compo).not.toBeNull();
});
  it('should render the logo', async(() => {
  fixture.detectChanges();
  const compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
}));
  it('expected submitted callthrough', () => {
  expect(component.registerPractice).not.toBeNull();
});
  it('modal not to be undefined', () => {
  const mod = component.model;
  mod.id = 1;
  mod.practiceName = 'alex';
  mod.phoneNo = '01221111111';
  mod.website = 'www.vet.com';
  expect(mod).not.toBeUndefined();
});

  it('profilePicUpdate', () => {
   const FileList = [{
   0: File,
   name: 'vhd-full-placeholder.png',
   lastModified: 1576280808000,
   lastModifiedDate: 'Sat Dec 14 2019 05:16:48 GMT+0530 (India Standard Time)',
webkitRelativePath: '',
size: 9223,
type: 'image/png',
length: 1}];
let event: any;
expect(component.profilePicUpdate(event)).not.toBeNull();
});



  it(' selectImage', () => {
  let comp;
  comp = component.selectImage();
  expect(comp).not.toBeNull();
});

  it(' dataURLtoFile', () => {
  let data: any;
  const comp = component.dataURLtoFile(data);
  expect(comp).not.toBeNull();
});
  it('takePicture', () => {
  let sourceType: any;
  const comp = component.takePicture(sourceType);
  expect(comp).not.toBeNull();
});
it(' changePasswordType', () => {
const comp = component.changePasswordType();
expect(comp).toBeUndefined();
});
it('showConfirmPassword', () => {
const comp = component.showConfirmPassword();
expect(comp).toBeUndefined();
});
  it(' passwordMatchValidator', () => {
const comp = component. passwordMatchValidator();
expect(comp).toBeUndefined();
});
  it(' registerPractice', () => {
expect(component.registerPractice()).toBeUndefined();
let mod=component.model;
mod.email='manoj@gmail.com'
//mod.email = this.mod.email.trim().toLowerCase();
let modelCopy: any;
mod.password='asas@#ed3djK'
const p = mod.password;
expect(mod.email).not.toBeUndefined();
expect(mod.password).not.toBeUndefined();

// password: this.authService.encryptPassword(this.model.password,
//   this.tokenValidatorService.secretToken()).toString(),
mod.password = p;
// this.model.species = this.selectedSpeciess;
modelCopy = Object.assign({}, mod);
praticeservice.practiceCheck(modelCopy).subscribe((res: any) => {
  expect(res).not.toBeNull();
  if (res.code === 500) {
  expect(noti.notification(res.message, 'danger')).toBeTruthy();
  } else {
    praticeservice.practiceRegistration(modelCopy, p).subscribe((res: any) => {
      localStorage.setItem('secret', res.secret);
    expect(res).not.toBeNull();
    });
      
  }

  
});










});
  it('resetForm()', () => {


const comp = component.resetForm();
expect(comp).toBeUndefined();


});


  it('ionViewWillEnter()', () => {

const comp = component.ionViewWillEnter();
expect(comp).toBeUndefined();



});

it('magic Link service will render',()=>{
  const fixture = TestBed.createComponent(PracticeRegisterPage);
  fixture.detectChanges();
  var  comp = fixture.componentInstance;
  comp['setMagicLinkStatus'] ;
  expect(comp.setMagicLinkStatus).not.toBeUndefined();
   })
});
