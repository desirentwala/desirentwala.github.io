import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListbarPage } from './listbar.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ListbarPage', () => {
  let de: DebugElement;
  let component: ListbarPage;
  let fixture: ComponentFixture<ListbarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListbarPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ListbarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
    it("selected method should be exhist", () => {
      expect(component.selected).toBeTruthy();
    });
    it("selected method should be exhist", () => {
      let data;
      let value;
      expect(component.selected(data,value)).toBeUndefined();
    });
    it("addNew method should be exhist", () => {
      expect(component.addNew).toBeTruthy();
    });
    it("ngOnInit should be exhist", () => {
      expect(component.ngOnInit).toBeTruthy();
    });
    it("ngOnInit should be exhist", () => {
      expect(component.ngOnInit()).not.toBeNull();
    });
    it("object null should be exhist", () => {
    //  let object;
      expect(component.addNew()).toBeUndefined();
    });
     it("search method should be exhist", () => {
      expect(component.search).toBeTruthy();
    });
    it("search fail by pass param", () => {
      const val = 'test123';
      const fixture = TestBed.createComponent(ListbarPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(component.search(val)).toBeUndefined();
      expect(component.search(val)).not.toBeNull();
    });
    it("ionViewWillEnter method will render", () => {
      const fixture = TestBed.createComponent(ListbarPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(component.ionViewWillEnter()).toBeUndefined();
      expect(component.ionViewWillEnter()).not.toBeNull();
    });
    it("ngOnChanges method will render", () => {
      const data = [{ 'test1': 'sample data'}]
      const fixture = TestBed.createComponent(ListbarPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(component.ngOnChanges()).toBeUndefined();
      expect(component.ngOnChanges()).not.toBeNull();
    });
    it("showAll method should be exhist", () => {
      expect(component.showAll).toBeTruthy();
    });
    it("showAll method should be exhist", () => {
      let data:any
      expect(component.showAll()).toBeUndefined();
    });
});
