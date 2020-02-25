import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule , NgForm} from '@angular/forms';
import { ForgotPasswordPage } from './forgot-password.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule} from '@ionic/storage';

import {
  HttpModule,
  XHRBackend,
  Response,
  ResponseOptions,
  RequestMethod
} from '@angular/http';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { AuthService } from 'src/app/common/services/auth.service';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NotificationService } from 'src/app/common/services/notification.service';
describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;
  const apiUrl = '../register/MockService.ts';
  let service: AuthService;
  let mockBackend: MockBackend;
  let  notificationService: NotificationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordPage ],
      imports: [FormsModule, HttpClientModule ,
        HttpClientTestingModule, RouterTestingModule, HttpModule, IonicModule.forRoot(), IonicStorageModule.forRoot()],
        providers: [AuthService, NotificationService, { provide: XHRBackend, useClass: MockBackend }]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(AuthService);
    notificationService = TestBed.get(NotificationService);
    mockBackend = TestBed.get(XHRBackend);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submission should exist', () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.submitforgotemail).toBeTruthy();
  });
  // checking email validation
  it('email field validity', () => {
    const email = component.ngForm.controls.email;
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

  });

  // form validation
  it('form should be valid', () => {
 component.ngForm.controls.email.setValue('manojkumar34340@gmail.com');
 expect(component.ngForm.valid).toBeTruthy();
});

it('should get the list of products from the server', inject(
  [AuthService],
  fakeAsync((service: AuthService) => {
    const testProducts = [
      {

        email: 'akshay4iay@gmail.com',

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
      const user = service.forgotPassword(testProducts).subscribe((res) => {
      expect(res).not.toBeNull();
     });

    } catch (err) {
      // why do you also expect an error to be thrown?
      expect(err).toContain('error');
    }
  })
));

  it('should test the table', () => {
  const de = fixture.debugElement;
  fixture.detectChanges();
  const rowDebugElement1 = de.queryAll(By.css('.top-header'));
  const rowDebugElement2 = de.queryAll(By.css('.disable-background'));
  const rowDebugElement3 = de.queryAll(By.css('.text-center'));
  const rowDebugElement4 = de.queryAll(By.css('.forgot-password'));
  const rowDebugElement5 = de.queryAll(By.css('.text-right'));
  const rowDebugElement6 = de.queryAll(By.css('.ion-toolbar'));
  const rowDebugElement7 = de.queryAll(By.css('.ion-content'));
  const rowDebugElement8 = de.queryAll(By.css('.ion-card-content'));
  const rowDebugElement9 = de.queryAll(By.css('.ion-card '));
  const rowDebugElements10 = de.queryAll(By.css('form'));
  const rowDebugElements11 = de.queryAll(By.css('label '));
  const rowDebugElements12 = de.queryAll(By.css('input '));
  const rowDebugElements13 = de.queryAll(By.css('small'));
  const rowDebugElements14 = de.queryAll(By.css(' div'));
  const rowDebugElements15 = de.queryAll(By.css('ion-button'));


  // expect(rowDebugElements.length).toBe(0);
  expect(rowDebugElement1).not.toBeUndefined();
  expect(rowDebugElement2).not.toBeUndefined();
  expect(rowDebugElement3).not.toBeUndefined();
  expect(rowDebugElement4).not.toBeUndefined();
  expect(rowDebugElement5).not.toBeUndefined();
  expect(rowDebugElement6).not.toBeUndefined();
  expect(rowDebugElement7).not.toBeUndefined();
  expect(rowDebugElement8).not.toBeUndefined();
  expect(rowDebugElement9).not.toBeUndefined();
  expect(rowDebugElements10).not.toBeUndefined();
  expect(rowDebugElements11).not.toBeUndefined();
  expect(rowDebugElements12).not.toBeUndefined();
  expect(rowDebugElements13).not.toBeUndefined();
  expect(rowDebugElements14).not.toBeUndefined();
  expect(rowDebugElements15).not.toBeUndefined();

  // const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr td');
  // expect(rowHtmlElements.length).toBe(0);
});


  it('submit function', () => {
    expect(notificationService.notification).toBeTruthy();
    expect(component.submitforgotemail).toBeTruthy();
    expect(service.forgotPassword).toBeTruthy();
    // tslint:disable-next-line: no-unused-expression
    expect(component.emailRegex).not.toBeNull;
    // tslint:disable-next-line: no-unused-expression
    expect(component.emailRegex).toString;
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ngForm).toBeDefined();
    expect(component.modal).toBeDefined();

});

  it('checking  email modal ', () => {
  const mode = component.modal;
  const res = mode.email = 'manoj@gmail.com';
  expect(res).not.toBeUndefined();

});
//   it('submit forgot password', () => {
// const result = component.submitforgotemail();
// expect(result).not.toBeNull();

// const ser=notificationService.notification('message','status');

// expect(ser).not.toBeNull();
// const services=service.forgotPassword('data');
// expect(services).not.toBeNull();
// const modal=component.modal;
// expect(modal).not.toBeNull();
// });


  it('notifications', () => {
  const noti = notificationService.notification('message', 'status');
  expect(noti).toBeTruthy();
});

  it('email regex', () => {
  const compo = component.emailRegex;
  const pat = ' /^(?!.*\.{2})[a-zA-Z0-9.-_]{1,64}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/';
  expect(compo).not.toBeNull();
});


  it('onCloseForgot', () => {
  expect(component.onCloseForgot).toBeTruthy();
});

  it('should render image for desktop', async(() => {

  fixture.detectChanges();
  const compiled = fixture.debugElement.nativeElement;
  expect(compiled.querySelector('img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
}));





  it(' submitforgotemail', () => {

const  comp = component.submitforgotemail();
expect(comp).toBeUndefined();



});


  it(' onCloseForgot()', () => {

const ecp = component.onCloseForgot();
expect(ecp).not.toBeNull();



});


// it('notification',()=>{
// let comp=component.notificationService.notification('message','status')

// expect(comp).not.toBeNull();

// })



  it('modal', () => {

  const mod = component.modal;
  // mod.email = mod.email.trim().toLowerCase();
  mod.email = 'manojku@gmail.com';
  expect(mod.email).not.toBeNull();
  // this.modal.email = this.modal.email.trim().toLowerCase();
  const modelCopy = Object.assign({}, mod);
  service.forgotPassword(modelCopy).subscribe(
    res => {
      if (res) {
         expect(notificationService.notification('Reset password' , 'success')).not.toBeUndefined();
          // this.forgot.reset();
          // this.router.navigateByUrl('/auth');
      }
    });







});
});
