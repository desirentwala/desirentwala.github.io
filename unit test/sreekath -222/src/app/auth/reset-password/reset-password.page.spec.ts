import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResetPasswordPage } from './reset-password.page';
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
import { IonicStorageModule } from '@ionic/storage';
import { NotificationService } from 'src/app/common/services/notification.service';
describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage ;
  let fixture: ComponentFixture< ResetPasswordPage >;
  const apiUrl = '../register/MockService.ts';
  let service: AuthService;
  let mockBackend: MockBackend;
let noti:NotificationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  ResetPasswordPage ],
      providers: [
        AuthService, NotificationService,
        { provide: XHRBackend, useClass: MockBackend }
      ],

      imports: [FormsModule,HttpModule, HttpClientModule,IonicStorageModule.forRoot(), ReactiveFormsModule ,
        HttpClientTestingModule, RouterTestingModule, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent( ResetPasswordPage );
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get( AuthService);
    mockBackend = TestBed.get(XHRBackend);
    noti=TestBed.get(NotificationService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reset should exist', () => {
    const fixture = TestBed.createComponent( ResetPasswordPage );
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app. resetPassword).toBeTruthy();
  });



// checking Null form Validation
  it('form invalid when empty', () => {
    component.loginForm.controls.password.setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });
// password validation
  it('password field validity', () => {
    const name = component.loginForm.controls.password;
    expect(name.valid).toBeFalsy();

    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();

  });

// form validation
  it('form should be valid', () => {
    component.loginForm.controls.password.setValue('mM1@sssssss');
    component.loginForm.controls.confirmpassword.setValue('mM1@sssssss');


    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should get the list of products from the server', inject(
    [AuthService],
    fakeAsync((service: AuthService) => {
      const testProducts = [
        {

          password: 'q2@WsssuP',


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
        const user = service.resetPassword(testProducts, '21212121').subscribe((res) => {
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

  it('init form builder', () => {
  const result = component.initFormBuilder();
  expect(result).not.toBeNull();

});
  it('reset password', () => {
  const result = component.getResetQueryParams();
  expect(result).not.toBeNull();

});
  it('password', () => {
  const result = component.password;
  expect(result).not.toBeNull();
});

  it('toggle password field', () => {
  const result = component.togglePasswordFieldType();
  expect(result).not.toBeNull();
});
  it('toggle confirm password field', () => {
  const result = component.toggleConfirmPasswordField();
  expect(result).not.toBeNull();
});

it('ngOnInit', () => {
  const result = component.ngOnInit();
  expect(result).not.toBeNull();
});

it('resetpassword',()=>{
  // expect(component.resetPassword()).not.toBeNull();
  // resetPassword() {
    const resetObj = {
        password:'ff&8GFGW(0'
    };
    service.resetPassword(resetObj, 1).subscribe((response) => {
        noti.notification('Password reset done, please login!' , 'success');
        // this.router.navigateByUrl('/auth');


    });
    expect(component.resetPassword()).toBeTruthy();
})

});
