import { TestBed } from '@angular/core/testing';
import { OnlineconsultationService } from './onlineconsultation.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule,  } from "@angular/router/testing";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../online-consultation/mockStorage';

describe('OnlineconsultationService', () => {
    let httpClient = HttpClient;
    let onlineConsultationService = OnlineconsultationService;
    let httpTestingController:HttpTestingController
    let mockStorage = Storage;
    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule,IonicStorageModule.forRoot(),RouterTestingModule], 
          providers: [
            OnlineconsultationService,
            {provide: Storage, useClass: MockStorage},
          ] 
        })
           mockStorage = TestBed.get(Storage)
           onlineConsultationService = TestBed.get(OnlineconsultationService);
           httpClient = TestBed.get(HttpClient);
           httpTestingController = TestBed.get(HttpTestingController);
        });   

  it('should be created', () => {
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service).toBeTruthy();
  });
  it('should be created "getToken"', () => {
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.getToken()).not.toBeNull();
  });
  it('should be created "setBookingDetails"', () => {
    const selectedAppointment = '';
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.setBookingDetails(selectedAppointment)).not.toBeNull();
  });
  it('should be created "getBookingDetails"', () => {
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.getBookingDetails()).not.toBeNull();
  });
  it('should be created "getOT"', () => {
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.getOT()).not.toBeNull();
  });
  it('should be created "sessionDetails"', () => {
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.sessionDetails()).not.toBeNull();
  });
  it('should be created "setSession"', () => {
    const sessionData = {'data':{'sessionId': 6}};
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.setSession(sessionData)).not.toBeNull();
  });
  it('should be created "getSession"', () => {
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.getSession()).not.toBeNull();
  });
  it('should be created "endSession"', () => {
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.endSession()).not.toBeNull();
  });
  it('should be created "connect"', () => {
    const Token = '';
    const service: OnlineconsultationService = TestBed.get(OnlineconsultationService);
    expect(service.connect(Token)).not.toBeNull();
  });
});
