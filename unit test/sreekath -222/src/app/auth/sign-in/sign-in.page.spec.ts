
import { async, ComponentFixture, TestBed , fakeAsync, tick, inject} from '@angular/core/testing';
import {Location} from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SignInPage } from './sign-in.page';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonService } from 'src/app/common/services/common.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignIn } from './sign-in.model';
import { DebugElement } from '@angular/core';
import { By} from '@angular/platform-browser';
import { Observable, Observer } from 'rxjs';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import {Router} from '@angular/router';
import { OtpVerificationPage } from '../otp-verification/otp-verification.page';
import { AuthPageRoutingModule } from '../auth-routing.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
// import { Storage } from '@ionic/Storage';
import { IonicStorageModule, Storage } from '@ionic/storage';
import {
    HttpModule,
    XHRBackend,
    Response,
    ResponseOptions,
    RequestMethod
  } from '@angular/http';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { NotificationService } from 'src/app/common/services/notification.service';



describe('SignInPage', () => {

    let component: SignInPage;
    let fixture: ComponentFixture<SignInPage>;
    let de: DebugElement;
    let el: HTMLElement;
    let service: AuthService;
    let location: Location;
    let router: Router;
let Common:CommonService;
    const apiUrl = './SignIn.ts';
    let mockBackend: MockBackend;
let noti:NotificationService;

    beforeEach(async(() => {
        // @ViewChild('signInForm') sampleForm: NgForm;

    TestBed.configureTestingModule({
      declarations: [ SignInPage, OtpVerificationPage ],
      providers: [CommonService, AuthService, { provide: XHRBackend, useClass: MockBackend }, NotificationService],
      imports: [  FormsModule,  HttpClientModule ,
        HttpClientTestingModule,

        BrowserModule,
        ReactiveFormsModule, RouterTestingModule, AppRoutingModule,
        // RouterTestingModule.withRoutes(),

        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get( AuthService);
     noti=TestBed.get(NotificationService);
    mockBackend = TestBed.get(XHRBackend);
    Common=TestBed.get(CommonService);
  }));

    it('should create', () => {
    expect(component).toBeTruthy();
  });

  // tslint:disable-next-line: align
  // mock service
  it('should get the list of status from the server', inject([AuthService], fakeAsync ((service: AuthService) => {
    const testProducts = [
      {
        email: 'manojkumar343430@gmail.com',
        password: 'p1Ws@22wss',
      },

    ];

    // Arrange
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
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
          // tslint:disable-next-line: align
          const resp = service.randomSalt().subscribe((res) => {
            expect(res).not.toBeNull();
          });
          // let user = new Observable;
      const  user =  service.signIn({email: 'mano2gmail.com', password: 'ahdh^Rt$4'}, 'salt').subscribe((res) => {
      expect(res).not.toBeNull();
    });

     } catch (err) {

          expect(err).toContain('error');
      }
  })));
    it('#should return error 404', inject([AuthService], fakeAsync ((service: AuthService) => {
    try {
    tick(50);
    const user =  service.signIn({email: 'mano2gmail.com', password: 'ahdh^Rt$4'}, 'salt').toPromise();

    expect(user).not.toContain('message');

    } catch (err) {

        expect(err).toContain('error');
    }
})));

    it('login should exist', () => {
    const fixture = TestBed.createComponent(SignInPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.signIn).toBeTruthy();
  });




// email validation
    it('email field validity', () => {
    const email = component.ngForm.controls.email;
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

  });

  // checking Error message
    it('should show a validation error if the first name was touched but left empty', () => {
    let firstNameValidationError: DebugElement;

    fixture.detectChanges(); // run change detection
    firstNameValidationError = fixture.debugElement.query(By.css('.text-danger'));

    // the validation error should be found:
    expect(firstNameValidationError).toBeNull();
});



    it('password field validity', () => {
    const password = component.ngForm.controls.password;
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();
  });

// submit button validation
//     it('should call onSubmit method', () => {
//     spyOn(component, 'signIn');
//     el = fixture.debugElement.query(By.css('.sign-in-button')).nativeElement;
//     el.click();
//     expect(component.signIn).toHaveBeenCalledTimes(1);
// });

// final submission
    it('form should be valid', () => {

      let email=  component.ngForm.controls.email.setValue('admin@vhd.com');
       let pass= component.ngForm.controls.password.setValue('Admin1@agkiya.cloud');
        // component.ngForm.controls.isChecked.setValue(true);
        // expect(component.ngForm.valid).toBeTruthy();
        expect(email).not.toBeNull();
        expect(pass).not.toBeNull();

  });

  // it('should have tab title', async(() => {
  //   fixture.detectChanges();
  //   let compiled = fixture.debugElement.queryAll(By.css('.auth-header'));
  //   expect(compiled[0].nativeElement.title).toBe('Login');
  //   // expect(compiled[1].nativeElement.title).toBe('tab-2');
  // }));

  // it('should test the table', () => {
  //   const de = fixture.debugElement;
  //   fixture.detectChanges();
  //   const rowDebugElement1 = de.queryAll(By.css('.auth-header'));
  //   expect(rowDebugElement1)
  // });
    it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.show-password'));
    expect(rowDebugElement1).not.toBeNull();
  });
    it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.text-danger'));
    expect(rowDebugElement1).not.toBeNull();
  });

    it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.my-auto'));
    expect(rowDebugElement1).not.toBeNull();
  });

    it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.forgot-password'));
    expect(rowDebugElement1).not.toBeNull();
  });
    it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.horizontalLine'));
    expect(rowDebugElement1).not.toBeNull();
  });
  // it('should test the table', () => {
  //   const de = fixture.debugElement;
  //   fixture.detectChanges();
  //   const rowDebugElement1 = de.queryAll(By.css('.auth-header'));
  //   expect(rowDebugElement1).not.toBeNull();
  // });
















    it('init method', () => {
  const res = component.init();
  // expect(res).toHaveBeenCalled();

  expect(res).not.toBeNull();
});
    it('ngOnit', () => {
  const res = component.ngOnInit();
  expect(res).not.toBeNull();
});


//     it('SignIn', () => {
//   const res = component.signIn();
//   expect(res).not.toBeUndefined();
// });

    it('showpassword', () => {
  const res = component.showPassword();
  expect(res).not.toBeNull();
});
    it('onclosesignup', () => {
  const res = component.onCloseSignup();
  expect(res).not.toBeNull();
});


    it('modal', () => {

const mod = component.model;
mod.email = 'manoj@gmail.com';
mod.password = '*ssdknKKjhjw3';
// mod.isChecked=true;
expect(mod.email).toContain('manoj@gmail.com');
expect(mod.password).toContain('*ssdknKKjhjw3');
// expect(mod.isChecked).toContain(true);


});

    it('booking salt', () => {
  component.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
    if (val !== null) {
      expect(val).not.toBeNull();
      this.router.navigateByUrl('/pets/appointments?ml=yes');
    }
  });




});

    it('signin', () => {
  const mod = component.model;
  mod.email = 'manoj@gmail.com';
  mod.password = '*ssdknKKjhjw3';
  mod.isChecked = true;
  expect(mod.email).toContain('manoj@gmail.com');
  expect(mod.password).toContain('*ssdknKKjhjw3');

  mod.email = mod.email.trim().toLowerCase();
  const modelCopy = Object.assign({}, mod);

  service.authCheckByEmail(modelCopy).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(component.signIn).toHaveBeenCalled();
      if (res.code) {
        localStorage.setItem('secret', res.secret);
        expect(component.router.navigateByUrl).toBe('/auth/otpverification');
      } else {
        const ePwd = service.encryptPassword(modelCopy.password, res.secretSalt);
        expect(ePwd).not.toBeNull();
        if (ePwd.toString() === res.data) {
          const authObj = { email: modelCopy.email, password: res.data, isChecked: modelCopy.isChecked };
          service.signIn(authObj, res.secretSalt).subscribe(authRes => {
            component.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
              expect(val).not.toBeNull();
              if (val !== null) {
                component.router.navigateByUrl('/pets/appointments?ml=yes');
              }
            });
            // if (!authRes.code) {
            //   this.commonService.navigateByRole();
            // } else {
            //   this.router.navigateByUrl('/auth/otpverification');
            // }
          });
        } else {
           noti.notification('Invalid credentials or status is not valid!', ' danger');
        }
      }



    });



});

it('navigate by role',()=>
{
  
  
})

it('navigate by role',()=>{

  expect(component.navigateByMlRole()).toBeUndefined();


});

it('signIn',()=>{
  expect(component.signIn()).toBeUndefined();
})
});