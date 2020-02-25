// import { TestBed } from '@angular/core/testing';
// import { AuthService } from './auth.service';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { RouterTestingModule,  } from "@angular/router/testing";
// import { HttpClient } from '@angular/common/http';
// import { Storage } from '@ionic/storage';
// import { IonicStorageModule } from '@ionic/storage';
// import { MockStorage } from '../services/mockStorage';

// describe('AuthService should render', () => {
//     let httpClient = HttpClient;
//     let authService = AuthService;
//     let httpTestingController:HttpTestingController
//     let mockStorage = Storage;
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//           imports: [HttpClientTestingModule,IonicStorageModule.forRoot(),RouterTestingModule], 
//           providers: [
//             AuthService,
//             {provide: Storage, useClass: MockStorage},
//           ] 
//         })
//            mockStorage = TestBed.get(Storage)
//            authService = TestBed.get(AuthService);
//            httpClient = TestBed.get(HttpClient);
//            httpTestingController = TestBed.get(HttpTestingController);
//         });  

//   it('should be created', () => {
//     const service: AuthService = TestBed.get(AuthService);
//     expect(service).toBeTruthy();
//   });
// });
