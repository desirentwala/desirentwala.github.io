import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PracticeListComponent } from './practice-list.component';
import { AddNewPracticerPage } from '../add-new-practicer/add-new-practicer.page';
import { ListbarPage } from 'src/app/common/components/listbar/listbar.page';
import { PracticerDetailsPage } from '../practicer-details/practicer-details.page';
import { FormsModule ,NgForm} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { VhdAdminService } from '../vhd-admin.service';
describe('PracticeListComponent', () => {
  let component: PracticeListComponent;
  let fixture: ComponentFixture<PracticeListComponent>;
let  Service: VhdAdminService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeListComponent ,AddNewPracticerPage,ListbarPage, PracticerDetailsPage],
      imports: [HttpClientModule ,
        HttpClientTestingModule,RouterTestingModule,HttpModule,FormsModule ,IonicModule.forRoot()],
        providers:[ VhdAdminService],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeListComponent);
    Service=TestBed.get(VhdAdminService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('selected pratice func',()=>
  {
      let result=component.selectedPractice('data');
expect(result).not.toBeNull();
  })



  it('ngOnit',()=>
  {
      let result=component.ngOnInit();
expect(result).not.toBeNull();
  })


  it('get all pratices',()=>
  {
      let result=component.getAllPractices();
expect(result).not.toBeNull();
  })


  it('add new pratices func',()=>
  {
let result=component.addNewPractice();
expect(result).not.toBeNull();
  })


it(' VhdAdminService',()=>
{
  let compo=Service.getAllPractices().subscribe((res)=>
  {
    expect(res).not.toBeNull();
  })
});

it('ngOnchanges',()=>{

expect(component.ngOnChanges()).toBeUndefined();

})



  
});
