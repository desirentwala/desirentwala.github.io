import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { OtpVerificationPage } from './otp-verification.page';
import { IonicStorageModule} from '@ionic/storage';

describe(' OtpVerificationPage', () => {
  let component: OtpVerificationPage ;
  let fixture: ComponentFixture< OtpVerificationPage >;
  const apiUrl = '../register/MockService.ts';
  let service: AuthService;
let mockBackend: MockBackend;


  beforeEach(async(() => {
 TestBed.configureTestingModule({
      declarations: [  OtpVerificationPage ],
      providers: [
        AuthService,
        { provide: XHRBackend, useClass: MockBackend },
      ],

      imports: [FormsModule, HttpModule, HttpClientModule, ReactiveFormsModule ,
        HttpClientTestingModule, RouterTestingModule, IonicModule.forRoot(), IonicStorageModule.forRoot()]
    }).compileComponents();

 fixture = TestBed.createComponent( OtpVerificationPage );
 component = fixture.componentInstance;
 fixture.detectChanges();
 service = TestBed.get( AuthService);
 mockBackend = TestBed.get(XHRBackend);
  }));

  it('should create', () => { 
      
    // const decode=component.decodeSecret.sub.secret = 3;
    // const userId=component.decodeSecret.sub.userId =3;
    // const exp=component.decodeSecret.exp;
    // const email=component.model.email;
    // const role=component.decodeSecret.sub.role;

//decode='12121';
//userId='121212122';
//exp='22222';
//email='manoj@gmail.com';
//role='vet';

// expect(component.decodeSecret.sub.secret).toBe(decode);
// expect(component.decodeSecret.sub.userId).toBe(userId);
// expect(component.decodeSecret.exp).toBe(exp);

expect(component.model.email).not.toBeNull();
expect(component.model.email).not.toBeNull();
expect(component.verifyotp()).not.toBeNull();
expect(component.verifyotp).not.toBeUndefined();
expect(component.resendotp()).not.toBeNull();
expect(component.resendotp).toBeTruthy();

 
  });
});
