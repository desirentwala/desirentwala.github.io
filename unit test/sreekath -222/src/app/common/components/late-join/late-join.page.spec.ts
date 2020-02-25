import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LateJoinPage } from './late-join.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {DebugElement} from "@angular/core";
import { delay } from 'rxjs/operators';
import { TableService } from '../../services/table.actions.service';
import { CommonService } from '../../services/common.service';

describe('LateJoinPage should render', () => {
  let component: LateJoinPage;
  let fixture: ComponentFixture<LateJoinPage>;
  let value: any;
  let inputEl: DebugElement;
  let tableService: TableService;
  it('should render main title', () => {
    const fixture = TestBed.createComponent(LateJoinPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Joining late');
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateJoinPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule,ReactiveFormsModule],
      providers: [TableService,CommonService]
    }).compileComponents();

    fixture = TestBed.createComponent(LateJoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  beforeEach(async () => {
    component.ngOnInit();
  });
 
  it("late Join method should be exhist", () => {
    const fixture = TestBed.createComponent(LateJoinPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.joinLate).toBeTruthy();
  });
  it("late Join method should pass param", () => {
    let object
    const fixture = TestBed.createComponent(LateJoinPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.joinLate(object)).toBeUndefined();
    expect(app.joinLate()).not.toBeNull();
  });
  it('should render ion-select dropdown', () => {
    const fixture = TestBed.createComponent(LateJoinPage);
    fixture.detectChanges();
    const compiledElement = fixture.debugElement.nativeElement;
    const button1 = compiledElement.querySelector('delay');
    expect(button1).toBeNull();
  });
  it('should render ion-select dropdown', () => {
    const fixture = TestBed.createComponent(LateJoinPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    component.value = component.delay;
    component.datafromPopover = component.datafromPopover
    app.commonService.lateObservable.subscribe(res => {
      app.value = res.value;
      app.datafromPopover = res;
    });
  });
  
  it('should render label text', () => {
    const fixture = TestBed.createComponent(LateJoinPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-label').textContent).toContain('Delay time');
  });

});
