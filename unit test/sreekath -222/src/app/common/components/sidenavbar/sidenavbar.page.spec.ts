import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule,  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { SidenavbarPage } from './sidenavbar.page';
import { FormsModule } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { MockStorage } from '../sidenavbar/mockStorage';

describe('SidenavbarPage', () => {
  let component: SidenavbarPage;
  let fixture: ComponentFixture<SidenavbarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavbarPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule,FormsModule],
      providers: [{provide: Storage, useClass: MockStorage},]
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavbarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("ngOnChanges should be exist", () => {
    const profilePic ='../../../../assets/user-avatar.svg';
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.ngOnChanges()).toBeUndefined();
  });
  it("selecteByRoute should be exist", () => {
    const navigation ='';
    const index = 3;
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.selecteByRoute(navigation, index)).toBeUndefined();
  });
  it("clickout should be exist", () => {
    const event = {traget: {value : 300}}
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.clickout(event)).toBeUndefined();
  });
  it("activeRouterHighLight should be exist", () => {
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.activeRouterHighLight()).toBeUndefined();
    expect(app.activeRouterHighLight()).not.toBeNull();
  });
  it("basePath should be exist", () => {
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.basePath).toBe('http://localhost:3001/');
    expect(app.basePath).not.toBeNull();
  });
  it("logout should be exist", () => {
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.logout()).toBeUndefined();
    expect(app.logout()).not.toBeNull();
  });
  it("ngOnInit should be exist", () => {
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.ngOnInit()).toBeUndefined();
    expect(app.ngOnInit()).not.toBeNull();
  });
  it("navigateToProfile should be exist", () => {
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.navigateToProfile()).toBeUndefined();
    expect(app.navigateToProfile()).not.toBeNull();
    expect(component.userProfile).toBeUndefined();
  });
  it("routeList should be exist", () => {
    component.routeList = [];
    const fixture = TestBed.createComponent(SidenavbarPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.routeList).toEqual([]);
    expect(app.routeList).not.toBeNull();
  });
});
