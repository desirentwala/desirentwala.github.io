import { TestBed } from '@angular/core/testing';

import { MagicLinkService } from './magic-link.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule,  } from "@angular/router/testing";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../magic-link/mockStorage';
import { Params, Router } from '@angular/router';


describe('MagicLinkService', () => {
    let httpClient = HttpClient;
    let magicLinkService = MagicLinkService;
    let httpTestingController:HttpTestingController
    let mockStorage = Storage;

    
  beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,IonicStorageModule.forRoot(),RouterTestingModule], 
    providers: [
      MagicLinkService,
      {provide: Storage, useClass: MockStorage},
    ] 
  })
     mockStorage = TestBed.get(Storage)
     magicLinkService = TestBed.get(MagicLinkService);
     httpClient = TestBed.get(HttpClient);
     httpTestingController = TestBed.get(HttpTestingController);
  });   
  it('should be created', () => {
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service).toBeTruthy();
  });
  it('should be created "checkforMaglinkId"', () => {
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service.checkforMaglinkId()).not.toBeNull();
  });
  it('should be created "setStatusToUsed"', () => {
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service.setStatusToUsed()).not.toBeNull();
  });
  it('should be created "initMagicLink"', () => {
    const param = Boolean;
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service.initMagicLink(param)).not.toBeNull();
  });
  it('should be created "createMagicLink"', () => {
    const param = Boolean;
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service.createMagicLink(param)).not.toBeNull();
  });
  it('should be created "verifyMagicLink"', () => {
    const id = 5;
    const random = 'sample data';
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service.verifyMagicLink(id,random)).not.toBeNull();
  });
  it('should be created "checkforMaglinkId"', () => {
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service.checkforMaglinkId()).not.toBeNull();
  });
  it('should be created "linkTragetRoute"', () => {
    const service: MagicLinkService = TestBed.get(MagicLinkService);
    expect(service.linkTragetRoute).not.toBeNull();
    expect(service._linkData.LinkType).toBeUndefined();
    expect(service._linkData.LinkType).toBeUndefined();
  });
  
 
 
});
