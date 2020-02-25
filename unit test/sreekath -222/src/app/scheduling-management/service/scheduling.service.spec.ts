import { TestBed } from '@angular/core/testing';
import { SchedulingService } from './scheduling.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule,  } from "@angular/router/testing";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { MockStorage } from '../service/mockStorage';

describe('SchedulingService will render', () => {
  let httpClient = HttpClient;
  let schedulingService = SchedulingService;
  let httpTestingController:HttpTestingController
  let mockStorage = Storage;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,IonicStorageModule.forRoot(),RouterTestingModule], 
      providers: [
        SchedulingService,
        {provide: Storage, useClass: MockStorage},
      ] 
    })
       mockStorage = TestBed.get(Storage)
       schedulingService = TestBed.get(SchedulingService);
       httpClient = TestBed.get(HttpClient);
       httpTestingController = TestBed.get(HttpTestingController);
    }); 
  it('should be created', () => {
    const service: SchedulingService = TestBed.get(SchedulingService);
    expect(service).toBeTruthy();
  });
  it('should be created "createSlotScheduling"', () => {
    const slotObj = '';
    const model   = {id:20};
    const service: SchedulingService = TestBed.get(SchedulingService);
    expect(service.createSlotScheduling(slotObj,model)).not.toBeNull();
  });
  it('should be created "getVetWeeklySlots"', () => {
    const vetId = '';
    const practiceId   = {id:20};
    const week     = 'this';
    const service: SchedulingService = TestBed.get(SchedulingService);
    expect(service.getVetWeeklySlots(vetId,practiceId,week)).not.toBeNull();
  });
  it('should be created "getPracticeWeeklySlots"', () => {
    const practiceId   = {id:20};
    const week     = 'this';
    const service: SchedulingService = TestBed.get(SchedulingService);
    expect(service.getPracticeWeeklySlots(practiceId,week)).not.toBeNull();
  });
  it('should be created "getWeekStartDate"', () => {
    const d   = {id:Date};
    const service: SchedulingService = TestBed.get(SchedulingService);
    expect(service.getWeekStartDate(d)).not.toBeNull();
  });
  it('should be created "dateConversion"', () => {
    const d   = {id:Date};
    const service: SchedulingService = TestBed.get(SchedulingService);
    expect(service.dateConversion(d)).not.toBeNull();
  });
  it('should be created "setSlotsAttributes"', () => {
    const slotList  = [{id:100}];
    const service: SchedulingService = TestBed.get(SchedulingService);
    expect(service.setSlotsAttributes(slotList)).not.toBeNull();
  });
});
