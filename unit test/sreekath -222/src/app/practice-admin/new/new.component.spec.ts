import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewComponent } from './new.component';
import { RouterTestingModule,  } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
  
} from "@angular/common/http/testing";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CardPage } from '../../common/components/card/card.page';
describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let speciesData =[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewComponent,CardPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('expects method should be intialized and it should be TRUE', () => {
    const fixture = TestBed.createComponent(NewComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.vetPicUpdate).toBeTruthy();
});
it('should upload the file - checkFileExist = true', () => {
  const event = { target: { value: 0 }};
  expect(component.vetPicUpdate(event)).toBeUndefined();
});

// it('should upload the file - checkFileExist = false', () => {
//   spyOn(component, 'checkFileExist').and.returnValue(false);
//   spyOn(postalService,'importPostalCodes').and.callThrough();
//   component.importFile();
//   expect(postalService.importPostalCodes).toHaveBeenCalledTimes(0);
// });
it('selectedSpecies method should be intialized', () => {
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.selectedSpecies).toBeTruthy();
});
it('createPet method should be intialized', () => {
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.createPet).toBeTruthy();
});
it('createPet should be pass an object', () => {
  let object;
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.createPet(object)).toBeUndefined();
});
it('showMoreSpecies method should be intialized', () => {
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.showMoreSpecies).toBeTruthy();
});
it('showMoreSpecies method should pass param', () => {
  let speciesList;
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.showMoreSpecies(speciesList)).not.toBeNull();
});
it('showLessSpecies method should be intialized', () => {
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.showLessSpecies).toBeTruthy();
});
it('showMoreSpecies method should pass param', () => {
  let speciesList;
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.showLessSpecies(speciesList)).not.toBeNull();
});
it('selectedSpecies method should be intialized', () => {
  let species: any
  const fixture = TestBed.createComponent(NewComponent);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.selectedSpecies(species)).toBeUndefined();
});
// it('selectedSpecies method should be intialized', () => {
//   const fixture = TestBed.createComponent(NewComponent);
//   fixture.detectChanges();
//   const app = fixture.debugElement.componentInstance;
//   expect(app.speciesData).toEqual('[object{pic: "pet.jpg", speciesName: "Dog" }]');
// });
});
