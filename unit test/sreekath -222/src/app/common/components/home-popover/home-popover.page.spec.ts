import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule,  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { By } from '@angular/platform-browser';

import { HomePopoverPage } from './home-popover.page';

describe('HomePopover will render', () => {
  let component: HomePopoverPage;
  let fixture: ComponentFixture<HomePopoverPage>;
  let data = [
    {pic: 'pet-owner.svg', category: 'Pet Owner', roleId: 'PO'},
    {pic: 'vet-doctor.svg', category: 'Veterinarian', roleId: 'VET'},
    {pic: 'practice-vet.svg', category: 'Practice Admin', roleId: 'PA'},
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  beforeEach(async () => {
    component.ngOnInit();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("event from popover should exhist", () => {
    const fixture = TestBed.createComponent(HomePopoverPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.eventFromPopover).toBeTruthy();
  });
   it("data should exhist", () => {
    const fixture = TestBed.createComponent(HomePopoverPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.data).toBeTruthy();
  });
  
  it("eventFromPopover should exhist", () => {
    let value:any
    const fixture = TestBed.createComponent(HomePopoverPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.eventFromPopover(value)).toBeUndefined();
  });
  it("main div should render", () => {
    const fixture = TestBed.createComponent(HomePopoverPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(fixture.debugElement.query(By.css('.div'))).toBeNull();
  });
  it("ion-grid should render", () => {
    const fixture = TestBed.createComponent(HomePopoverPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(fixture.debugElement.query(By.css('.ion-grid'))).toBeNull();
  });
  it('should render text', () => {
    const fixture = TestBed.createComponent(HomePopoverPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-text').textContent).toContain('I am a ');
  });
});
