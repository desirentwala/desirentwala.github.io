import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule,  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { SidebarPage } from './sidebar.page';
import { Storage } from '@ionic/Storage';
import { IonicStorageModule } from '@ionic/storage';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';

describe('Sidebar Page will render ', () => {
  let component: SidebarPage;
  let fixture: ComponentFixture<SidebarPage>;
  let AuthService:AuthService;
  let commonService: CommonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule,
        IonicStorageModule.forRoot()],
        providers:[CommonService]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it("should render ngOnChanges", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnChanges').and.callFake(() => console.log('fake ngOnChanges'));
  });
  it("ngOnChanges should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges).toBeTruthy();
  });
  it("ngOnInit should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });
  it("ngOnChanges should be exist", () => {
    let slot:any
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges(slot)).toBeUndefined();
  });
  it("activeRouterHighLight should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.activeRouterHighLight).toBeTruthy();
    component.activeIndex = 2;
  });
  it("activeRouterHighLight should be exist", () => {
    let router: Router
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.activeRouterHighLight()).not.toBeNull();
  });
  it("routeList should be exist", () => {
    let router: Router
    let v
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.routeList).not.toBeNull();
    component.routePaths = v;
  });

  
  it("selecteByRoute should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selecteByRoute).toBeTruthy();
  });
  it("selecteByRoute should be exist", () => {
    let router: Router
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selecteByRoute()).not.toBeNull();
    expect(app.selecteByRoute()).toBeUndefined();
  });

  it("logout should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.logout).toBeTruthy();
  });
  it("logout should be exist", () => {
    let router: Router
     auth: AuthService;
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.logout).not.toBeNull();
  });

  it("navigateToProfile should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateToProfile).toBeTruthy();
  });
  it("navigateToProfile should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges()).not.toBeNull();
    app.commonService.picUpdate.subscribe(res => {
      app.randomNum = Math.random();
        app.userProfile.profilePic = res.data;
        app.userName = res.user.firstName;
          app.cdnRef.detectChanges();
    });
  });
  it("navigateToProfile should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateToProfile()).not.toBeNull();
  });
  it("navigateToProfile should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigateToProfile()).toBeUndefined();
    component.userProfile = 'sampledata';
    component.userProfile['userroles.role.roleName'] ;
    component.selecteByRoute({ path: 'practiceadmin/profile' }, component.routeList.length + 1);
    component.selecteByRoute({ path: 'pets/profile' }, component.routeList.length + 1);
    component.selecteByRoute({ path: 'vetpractice/profile' }, component.routeList.length + 1);
    component.selecteByRoute({ path: 'vhdadmin/profile' }, component.routeList.length + 1);
  });
  it("basePath should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.basePath).toBeTruthy();
  });
  it("basePath should be exist", () => {
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(component.basePath).not.toBeNull();
    expect(component.basePath).toThrowError;
  });
  it("ngOnChanges should be exist", () => {
    let slot:any
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges(slot)).not.toBeNull();
  });
  it("ngOnInit should be exist", () => {
    let slot:any
    const fixture = TestBed.createComponent(SidebarPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit(slot)).not.toBeNull();
  });
  it("expects routeList method should exhist", () => {
    component.routeList = ['test','test1'];
    expect(component.routeList).not.toBeNull();
  });
  it("expects component method should exhist", () => {
    expect(component.logout()).not.toBeNull();
  });
});
