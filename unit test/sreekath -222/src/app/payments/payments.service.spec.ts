import { TestBed } from '@angular/core/testing';

import { PaymentsService } from '../payments/payments.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule,  } from "@angular/router/testing";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../payments/mockStorage';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

describe('PaymentService should render', () => {
    let httpClient = HttpClient;
    let paymentsService = PaymentsService;
    let httpTestingController:HttpTestingController
    let mockStorage = Storage;
    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule,IonicStorageModule.forRoot(),RouterTestingModule], 
          providers: [
            PaymentsService,
            {provide: Storage, useClass: MockStorage},
          ] 
        })
           mockStorage = TestBed.get(Storage)
           paymentsService = TestBed.get(PaymentsService);
           httpClient = TestBed.get(HttpClient);
           httpTestingController = TestBed.get(HttpTestingController);
        });  

  it('should be created', () => {
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service).toBeTruthy();
  });
  it('should be created "getSessionid"', () => {
    const PaymentDetails = '';
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service.getSessionid(PaymentDetails)).not.toBeNull();
  });
  it('should be created "onSuccess"', () => {
    const data = 'test Transaction Success';
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service.onSuccess(data)).not.toBeNull();
  });
  it('should be created "updateStatus"', () => {
    const data = 'test update Success';
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service.updateStatus(data)).not.toBeNull();
  });
  it('should be created "getSessionData"', () => {
    const data = 'test session Success';
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service.getSessionData(data)).not.toBeNull();
  });
  it('should be created "getSessionData"', () => {
    const checkoutData = {slot:{appointmentType:'private'}};
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service.onCheckOut(checkoutData)).not.toBeNull();
  });
  it('should be created "SetAppoitment"', () => {
    const appoitmentData = 'test appoitmentData';
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service.SetAppoitment(appoitmentData)).not.toBeNull();
  });
  it('should be created "getAppoitmentData"', () => {
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service.getAppoitmentData()).not.toBeNull();
    expect(service.getAppoitmentData()).toBeUndefined();
  });
});
