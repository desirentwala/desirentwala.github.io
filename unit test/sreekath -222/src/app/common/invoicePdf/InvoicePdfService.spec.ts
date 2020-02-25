import { TestBed } from '@angular/core/testing';

import { InvoicePdfService } from './InvoicePdfService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule,  } from "@angular/router/testing";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../invoicePdf/mockStorage';
import { Params, Router } from '@angular/router';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController } from '@ionic/angular';
import { logo } from './logo';
import { InvoiceService } from './invoice.service';
import { DateConvertorService } from '../services/date-convertor.service';
//import  * as jsPDF from './InvoicePdfService';
describe('InvoicePdfService will render', () => {
    let httpClient = HttpClient;
    let invoicePdfService = InvoicePdfService;
    let httpTestingController:HttpTestingController
    let mockStorage = Storage;
    
  beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,IonicStorageModule.forRoot(),RouterTestingModule], 
    providers: [
    InvoicePdfService,File,FileOpener,InvoiceService,DateConvertorService,
      {provide: Storage, useClass: MockStorage},
    ] 
  })
     mockStorage = TestBed.get(Storage)
     invoicePdfService = TestBed.get(InvoicePdfService);
     httpClient = TestBed.get(HttpClient);
     httpTestingController = TestBed.get(HttpTestingController);
  });   
  it('should be created', () => {
    const service: InvoicePdfService = TestBed.get(InvoicePdfService);
    expect(service).toBeTruthy();
  });
  it('should be created "generateInvPDF"', () => {
    const bookingId = 5;
    let loadingCtrl:LoadingController
   // const doc = new jsPDF('p', 'pt', 'a4');
    const service: InvoicePdfService = TestBed.get(InvoicePdfService);
    expect(service.generateInvPDF(bookingId)).not.toBeNull();
    expect(service.loadingCtrl).toBeTruthy();
  });
  it('should be created "generateJsPDF"', () => {
    var invObj :any;
    const service: InvoicePdfService = TestBed.get(InvoicePdfService);
    expect(service.generateJsPDF(invObj)).not.toBeNull();
  });
  it('should be created "presentLoading"', () => {
    const msg = '';
    const service: InvoicePdfService = TestBed.get(InvoicePdfService);
    expect(service.presentLoading(msg)).not.toBeNull();
  });
  it('should be created "destroy"', () => {
    const service: InvoicePdfService = TestBed.get(InvoicePdfService);
    expect(service.destroy()).not.toBeNull();
  });
});
