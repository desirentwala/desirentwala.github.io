import { TestBed } from '@angular/core/testing';

import { AuthGuard } from '../auth-guards/auth-guard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule,  } from "@angular/router/testing";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../mockStorage';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('AuthService should render', () => {
    let httpClient = HttpClient;
    let authGuard = AuthGuard;
    let httpTestingController:HttpTestingController
    let mockStorage = Storage;
    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule,IonicStorageModule.forRoot(),RouterTestingModule], 
          providers: [
            AuthGuard,
            {provide: Storage, useClass: MockStorage},
          ] 
        })
           mockStorage = TestBed.get(Storage)
           authGuard = TestBed.get(AuthGuard);
           httpClient = TestBed.get(HttpClient);
           httpTestingController = TestBed.get(HttpTestingController);
        });  

  it('should be created', () => {
    const service: AuthGuard = TestBed.get(AuthGuard);
    expect(service).toBeTruthy();
  });
  it('should be created "canActivate"', () => {
     let state: RouterStateSnapshot;
     let route: ActivatedRouteSnapshot;
    const service: AuthGuard = TestBed.get(AuthGuard);
    expect(service.canActivate(route,state)).not.toBeNull();
  });
});
