import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BaseroutePage } from './baseroute.page';
import { FormsModule } from "@angular/forms";
import { RouterTestingModule,  } from "@angular/router/testing";

import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { SidenavbarPage } from 'src/app/common/components/sidenavbar/sidenavbar.page';
import { SidebarPage } from 'src/app/common/components/sidebar/sidebar.page';
import { IonicStorageModule } from '@ionic/storage';

describe('BaseroutePage', () => {
  let component: BaseroutePage;
  let fixture: ComponentFixture<BaseroutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseroutePage , SidenavbarPage,SidebarPage],
      imports: [IonicModule.forRoot(),FormsModule,RouterTestingModule,HttpClientTestingModule, IonicStorageModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseroutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(' navigationInitialize',()=>
  {
      expect(component.navigationInitialize()).toBeUndefined();
  });
  it('ngOnit',()=>
  {

 // practice navigations
 
 let  router =[{
      title: 'Dashboard',
      path: 'practiceadmin/dashboard',
      icon: 'fal fa-home',
    },
    {
      title: 'Vets',
      path: 'practiceadmin/slotscheduling',
      icon: 'fal fa-user-md'
    },
    {
      title: 'Customers',
      path: 'practiceadmin/customer',
      icon: 'fal fa-user',
    },
    {
      title: 'Appointments',
      path: 'practiceadmin/appointments',
      icon: 'fal fa-video-plus'
    },
    {
      title: 'Settings',
      path: 'practiceadmin/settings',
      icon: 'fal fa-cogs'
    }
  ];
  












      expect(component.ngOnInit()).toBeUndefined();
      expect(component.navigationList).toBeUndefined();




     let comp= component.navigationList ;
     comp= router;
      expect(comp).toBeUndefined();
    //   this.commonService.routesSubject.next({routeList: this.navigationList});
  })
});
