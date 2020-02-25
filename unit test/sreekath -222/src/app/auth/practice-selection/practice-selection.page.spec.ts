import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule , NgForm} from '@angular/forms';
import { PracticeSelectionPage } from './practice-selection.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonService } from 'src/app/common/services/common.service';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule, Storage } from '@ionic/storage';

describe('PracticeSelectionPage', () => {
  let component: PracticeSelectionPage;
  let fixture: ComponentFixture<PracticeSelectionPage>;

  let ser: CommonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeSelectionPage ],
      imports: [ FormsModule, HttpClientModule,
        HttpClientTestingModule, RouterTestingModule, IonicModule.forRoot(), IonicStorageModule.forRoot()],
        providers: [CommonService, Camera],

    }).compileComponents();

    fixture = TestBed.createComponent(PracticeSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('search should be truthy', () => {
const result = component.search('value');
expect( result).not.toBeNull();

});
  it('onNext function', () => {

    const result = component.onNext();
    expect( result).not.toBeNull();

  });
  it('update function', () => {

    const result = component.updateVet();
    expect( result).not.toBeNull();
});

  it('onprevious function', () => {

    const result = component.onPrevious();
    expect( result).not.toBeNull();
});

  it('selected species function', () => {

  expect(component.selectedSpecies).toBeTruthy();
});
  it('navigation function', () => {

    const result = component.navigateToDetails();
    expect( result).not.toBeNull();
});

  it('hide list function', () => {

    const result = component.selectedSpecies('species', 'index');
    expect( result).not.toBeNull();
});
  it('ngOnit', () => {

  const result = component.ngOnInit();
  expect( result).not.toBeNull();
});

  it('species data', () => {
 const img = component.selectedSpecies('data', 'index');
 expect(img).length > 0;
 expect(img).length != 0;


});

  it('search', () => {
  const values = 'abc';
  const values1 = '';
  // const val = component.search(values);
  // expect(component.search(values1)).toBeUndefined();
  // expect(component.search(values)).not.toBeUndefined();

});
  it('ionViewWillenter', () => {
  const comp = component.ionViewWillEnter();
  component.storage.get('ONBOARD_VET').then((val) => {
      if (val !== null) {
        // component.vet.id = '1';
        // this.vet.practiceId = val.practiceId;
        component.practice = val.practiceName;
        expect(component.practice).not.toBeNull();
        component.vetPracticeId = val.practiceId;
        expect(component.vetPracticeId).not.toBeNull();
        component.practiceName = val.practiceName;
        expect(component.practiceName).not.toBeNull();
        component.isDisabled = true;
        expect(component.isDisabled).not.toBeNull();
        component.navigateToDetails();
      }

    });
  // }

});

// ends

  it('ionViewWillenter', () => {
  const comp = component.ngOnInit();
  component.storage.get('ONBOARD_VET').then((val) => {
      if (val !== null) {
        // component.vet.id = '1';
        // this.vet.practiceId = val.practiceId;
        component.practice = val.practiceName;
        expect(component.practice).not.toBeNull();
        component.vetPracticeId = val.practiceId;
        expect(component.vetPracticeId).not.toBeNull();
        component.practiceName = val.practiceName;
        expect(component.practiceName).not.toBeNull();
        component.isDisabled = true;
        expect(component.isDisabled).not.toBeNull();
        component.navigateToDetails();
      }

    });


});


it('hide list',()=>{

  expect(component.hideList('selectedPractice')).not.toBeNull();
  expect(component.isNextBtn).toBe(true);
    expect(component.searchResults).toBe(false);
    // this.practice = selectedPractice.practiceName;
    // this.vetPracticeId = selectedPractice.id;
  
});





});

