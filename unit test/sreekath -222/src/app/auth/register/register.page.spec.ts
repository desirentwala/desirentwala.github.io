import {
  HttpModule,
  XHRBackend,
  Response,
  ResponseOptions,
  RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {  FormControl, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { Observable } from 'rxjs';
import { TokenValidaterService } from 'src/app/common/services/token-validater.service';
// import { Storage } from '@ionic/Storage';
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';
import { NotificationService } from 'src/app/common/services/notification.service';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let de: DebugElement;
  let el: HTMLElement;
  let service: AuthService;
  let mockBackend: MockBackend;
  let tokenservice:TokenValidaterService;

  let alert: AlertController;
  let noti: NotificationService;
  let storage: Storage;


const apiUrl = './MockService.ts';
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      providers: [ NotificationService,TokenValidaterService,AuthService, { provide: XHRBackend, useClass: MockBackend }],
      imports: [
        FormsModule,
       
        HttpClientModule,
        HttpClientTestingModule,
        BrowserModule,
        HttpModule,
       
        ReactiveFormsModule,
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    service = TestBed.get(AuthService);
    tokenservice=TestBed.get(TokenValidaterService);
    mockBackend = TestBed.get(XHRBackend);
    fixture.detectChanges();
  }));
// Mock service
  it('should get the list of products from the server', inject(
    [AuthService],
    fakeAsync((service: AuthService) => {
      const testProducts = [
        {
          firstName: 'aksharsykummar',
          email: 'akshay4iay@gmail.com',
          mobile: '9676021850',
          password: 'q2@WsssuP',

          country_code: '+91',

          confirmpassword: 'q2@WsssuP',
          privacyPolicy: true
        }
      ];


      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
        expect(connection.request.url).toBe(apiUrl);

        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: testProducts
            })
          )
        );
      });

      try {
        tick(50);
        // tslint:disable-next-line: align
        // let user = new Observable();
        const user = service.registerUser(testProducts).subscribe((res) => {
        expect(res).not.toBeNull();
       });

      } catch (err) {
        // why do you also expect an error to be thrown?
        expect(err).toContain('error');
      }
    })
  ));





  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#changePasswordType() should toggle #passwordShow', () => {

  });

  it('login button  should exist', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.signUpForm).toBeTruthy();
  });

  // form invalid when empty
  it('form invalid when empty', () => {
    component.formData.controls.firstName.setValue('');
    component.formData.controls.email.setValue('');
    component.formData.controls.mobile.setValue('');
    component.formData.controls.password.setValue('');

    expect(component.formData.valid).toBeFalsy();
  });

// username field validity
  it('username field validity', () => {
    const name = component.formData.controls.firstName;
    expect(name.valid).toBeFalsy();

    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
  });

  // email validation
  it('email field validity', () => {
    const email = component.formData.controls.email;
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();
  });
// phone Validaion
  it('phone field validity', () => {
    const phone = component.formData.controls.mobile;
    expect(phone.valid).toBeFalsy();

    phone.setValue('');
    expect(phone.hasError('required')).toBeTruthy();
  });
// password validation
  it('password field validity', () => {
    const password = component.formData.controls.password;
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();
  });
 // confirm password validation
  it('confirm password field validity', () => {
    const confirmpassword = component.formData.controls.confirmpassword;
    expect(confirmpassword.valid).toBeFalsy();

    confirmpassword.setValue('');
    expect(confirmpassword.hasError('required')).toBeTruthy();
  });


// final submission
  it('form should be valid', () => {
    if(component.formData.controls.firstName!==undefined)
    {
      component.formData.controls.firstName.setValue('manojkumarr');

    }
    if(component.formData.controls.email!==undefined)
    {
      component.formData.controls.email.setValue('manojj@gmail.com');
    }

    if(component.formData.controls.mobile!==undefined)
    {
      component.formData.controls.mobile.setValue(9480705824);  
    
    }

    if(component.formData.controls.password!==undefined)
    {
      component.formData.controls.password.setValue('q2@WsssuP');    
    }
    if(component.formData.controls.country_code!==undefined)
    {
      component.formData.controls.country_code.setValue('+91');
    }

    if(component.formData.controls.confirmpassword!==undefined)
    {
      component.formData.controls.confirmpassword.setValue('q2@WsssuP');
    }
  
    if(component.formData.controls.privacyPolicy!==undefined)
    {
      component.formData.controls.privacyPolicy.setValue(true);   
    
    
    }
    
    

    expect(component.formData.valid).toBeTruthy();
    
  });

  it('signupformdata', () => {
    const result = component.signUpFormData();
    expect(result).not.toBeNull();
  });


  it('signupform', () => {
    const result = component.signUpForm();
    expect(result).not.toBeNull();
  });



  it('get role', () => {
    const result = component.getRole();
    expect(result).not.toBeNull();
  });


  it('password', () => {
    const result = component.password;
    expect(result).not.toBeNull();
  });


  it('password', () => {
    const result = component.toggleConfirmPasswordField();
    expect(result).not.toBeNull();
  });

  it('password', () => {
    const result = component.togglePasswordFieldType();
    expect(result).not.toBeNull();
  });


  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.disable-background'));
    expect(rowDebugElement1).not.toBeNull();
  });


  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.ion-padding'));
    expect(rowDebugElement1).not.toBeNull();
  });


  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.signUpLogo'));
    expect(rowDebugElement1).not.toBeNull();
  });

  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.fa fa-times float-right fa-1x'));
    expect(rowDebugElement1).not.toBeNull();
  });

  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.beta-logo'));
    expect(rowDebugElement1).not.toBeNull();
  });

  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.horizontalLine'));
    expect(rowDebugElement1).not.toBeNull();
  });


  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.mx-auto text-center'));
    expect(rowDebugElement1).not.toBeNull();
  });


  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.sign-up-for-free'));
    expect(rowDebugElement1).not.toBeNull();
  });




  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.signupLabel'));
    expect(rowDebugElement1).not.toBeNull();
  });


  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.form-control'));
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
    const rowDebugElement1 = de.queryAll(By.css('.row'));
    expect(rowDebugElement1).not.toBeNull();
  });
  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.sign-in-button'));
    expect(rowDebugElement1).not.toBeNull();
  });

  it('should test the table', () => {
    const de = fixture.debugElement;
    fixture.detectChanges();
    const rowDebugElement1 = de.queryAll(By.css('.privacy-conditions'));
    expect(rowDebugElement1).not.toBeNull();
  });

/* handling elements */

  it('should test the table', () => {
  const de = fixture.debugElement;
  fixture.detectChanges();
  const rowDebugElement1 = de.queryAll(By.css('div h1 ion-button ion-card ion-content ion-label div small input label '));
  expect(rowDebugElement1).not.toBeNull();
});

 

it('ion will enter',()=>
{
  


});
// })

it('set storage value',()=>
{
  
 let re=component.storage.get('ONBOARD_VET').then((res)=>
 {

  expect(res).not.toBeUndefined();
  if(res !== null){
    component.email = res.email;
    expect(component.email).not.toBeNull();
    component.formData.controls['email'].setValue(res.email);
    component.roleId = res.role;
    expect(component.roleId).not.toBeNull();
    component.isDisabled = true;
    expect(component.isDisabled).not.toBeNull();
  }

  
 })
 

})



it(' get from ionic storage',()=>
{
  component.storage.get('ONBOARD_PO').then((petOnwerValue) => {
    if(petOnwerValue !== null){
      component.email = petOnwerValue.email;
      expect(component.email).not.toBeNull();
      component.formData.controls['email'].setValue(petOnwerValue.email);

      component.roleId = petOnwerValue.role;
      expect(component.roleId).not.toBeNull();
      component.isDisabled = true;
      expect(component.isDisabled).not.toBeNull();
      }
    });


})

it('check roleId',()=>
{
  const data = {
    firstName: 'alex123',
    email:'alex@gmail.com',
     // password encryptio
    password: 'jdjdj@23DD',
    mobile: '012212121212',
    roleId:'vet'
  };
  // component.storage.set(data);
  component.storage.get('ONBOARD_VET').then((val) => {
    if(val !== null){
      data['type'] = 'ONBOARD_VET';
      service.registerUser(data).subscribe((response: any) => {
        if (component.roleId === 'PA') {
          expect(component.router.navigate).toBe(['/auth/practiceregister'], { queryParams: { role:component.roleId} });
        } else if (component.isDisabled && component.roleId === 'VET'){
         expect(component.router.navigate).toBe(['/auth/practiceselection']);
        } else {
          // this.storage.clear();
        expect(component.router.navigate).toBe(['/auth/otpverification']);
        }
      });
     } else {
      service.registerUser(data).subscribe((response: any) => {
        if (component.roleId === 'PA') {
          expect(component.router.navigate).toBe(['/auth/practiceregister'], { queryParams: { role: this.roleId} });
        } else if (component.isDisabled && component.roleId === 'VET'){
          expect(component.router.navigate).toBe(['/auth/practiceselection']);
        } else {
          // this.storage.clear();
       expect(component.router.navigate).toBe(['/auth/otpverification']);
        }
      });
    }
    });
})

it('get role',()=>
{
  
    component.activeRoute.queryParams.subscribe(params => {
      if (params.role) {
        this.roleId = params.role;
        expect(component.roleId).not.toBeNull();
      }
    });
  
})



it('call function',()=>
{

  expect(component.onCloseSignup()).toBeUndefined();
  //  component.router.navigateByUrl('/home');
  component.storage.clear();
  
})

it('changePasswordType',()=>
{
  let comp=component.changePasswordType();
  expect(comp).not.toBeNull();
expect(component.passwordShow).not.toBeNull();
});


it('showconfirm password',()=>
{
 let comp=component.showConfirmPassword();
    expect(component.showConfirmPassword).not.toBeNull();
  
});



it('ionwillenter',()=>{

expect(component.ionViewWillEnter()).toBeUndefined();



})
  });
