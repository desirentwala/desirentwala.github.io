import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BaseRoutePage } from './base-route.component';




import { FormsModule ,NgForm} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vhdAdminNavigationList } from '../../common/components/sidebar/titles';
import { CommonService } from '../../common/services/common.service';

import {
    HttpModule,
    XHRBackend,
    Response,
    ResponseOptions,
    RequestMethod
  } from '@angular/http';
describe('BaseRouteComponent', () => {
  let component: BaseRoutePage;
  let fixture: ComponentFixture<BaseRoutePage>;
let service: CommonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseRoutePage ],
      imports: [FormsModule,HttpClientModule ,
        HttpClientTestingModule,RouterTestingModule,HttpModule,IonicModule.forRoot()],
      schemas:[NO_ERRORS_SCHEMA,]
      
    }).compileComponents();

    fixture = TestBed.createComponent(BaseRoutePage);
    component = fixture.componentInstance;
    service=TestBed.get(CommonService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('service',()=>{

    expect(component.navigationInitialize()).toBeUndefined();
        // this.navigationList = vhdAdminNavigationList;
       let ser= service.routesSubject.next('list');
       expect(ser).not.toBeNull();
      
  })
});
