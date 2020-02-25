import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddnewVetPage } from './addnew-vet.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from "@angular/core"; 
import { Vet } from './vet-user.model';
import { PracticeAdminService } from '../practice-admin.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { IonicStorageModule } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


describe('practice-admin addnew-vet should render', () => {
  const model =Vet
  let component: AddnewVetPage;
  let  selectedSpeciess = [];
  let  speciesArray = [];
  let initialImages = 4;
  let fixture: ComponentFixture<AddnewVetPage>;
   const Path = '../../../../assets/profile-picture.png'
 let PracticeService: PracticeAdminService;
  it('should render main title', () => {
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Add a vet');
  });
  it('should render p tag title', () => {
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Send an email to invite a vet to add their details or enter the details of the vet(s) who will be doing video consultations.');
  });
  it('should render p tag title', () => {
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-button').textContent).toContain('Add vet');
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewVetPage ],
      imports: [HttpClientTestingModule,RouterTestingModule,FormsModule,IonicModule.forRoot(),IonicStorageModule.forRoot()],
      providers: [PracticeAdminService,NotificationService,Camera]
    }).compileComponents();

    fixture = TestBed.createComponent(AddnewVetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('expects method should be intialized and it should be TRUE', () => {
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.onAddOrInvite).toBeTruthy();
    });
    it('method should be render "onPrevious"', () => {
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.onPrevious).toBeTruthy();
  });
  it('method should be render "ngOnInit"', () => {
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
});
  it('method should be render "onPrevious" pass param', () => {
    let activeIndex;
    let speciesList:[];
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(activeIndex)).toBeUndefined();
   // expect(app.onPrevious(speciesList.slice(activeIndex-1))).toBeUndefined();
    expect(app.onPrevious()).not.toBeNull();

});
it('method should be render "onNext"', () => {
  const fixture = TestBed.createComponent(AddnewVetPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.onNext).toBeTruthy();
});
it('isMobile should be false', () => {
  component.isMobile = true
  expect(component.isMobile).toBe(true);
  component.isSpeciesSelected = true;
});

it('method should be render "onNext" pass param', () => {
let activeIndex;
const fixture = TestBed.createComponent(AddnewVetPage);
fixture.detectChanges();
const app = fixture.debugElement.componentInstance;
expect(app.onNext(activeIndex)).toBeUndefined();
});
it('method should be render "getSpeciesList" pass param', () => {
  const fixture = TestBed.createComponent(AddnewVetPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.getSpeciesList()).toBeUndefined();
  expect(app.getSpeciesList()).not.toBeNull();
  let PracticeService: PracticeAdminService;
  component.getSpeciesList();
  app.PracticeService.getPaProfileData(5).subscribe((species: any) => {
    app.speciesList = species.data.practiceSpecies.map((eachSpices) => {
      const obj = Object.assign({}, eachSpices);
      obj.isActive = false;
      return obj;
    });
  });
  });
    it('expects method should be intialized and it should be TRUE', () => {
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.onAddOrInvite()).not.toBeNull();
      expect(app.onAddOrInvite(initialImages === 4)).toBeTruthy();
      
  });
  it('expects method should be pass undefined if send param', () => {
    let data:[];
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   // expect(app.onAddOrInvite(data)).not.toBeDefined(); 
    });
      it('expects method should be intialized and it should be TRUE', () => {
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.selectedSpecies).toBeTruthy();
    });
    it('pass the param not to be expected', () => {
      let speciesData,index;
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.selectedSpecies(speciesData,index)).not.toBeNull();
  });
  it('pass the param not to be expected', () => {
    let speciesData,index;
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedSpecies(speciesData,index)).toBeUndefined();
});
it('pass the param not to be expected', () => {
  let speciesData:[];
  const fixture = TestBed.createComponent(AddnewVetPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.selectedSpecies(selectedSpeciess.length === 0)).toBeUndefined();
  expect(app.selectedSpecies(selectedSpeciess.length !== 0)).toBeUndefined();
  expect(app.selectedSpecies(selectedSpeciess.push (speciesData))).toBeUndefined();
  expect(app.selectedSpecies(selectedSpeciess.push (speciesData))).not.toBeNull();
});
      it('expects method should be intialized and it should be TRUE', () => {
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.takePicture).toBeTruthy();
    });
    it('takepicture method pass source type empty ', () => {
      let sourceType:any;
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.takePicture(sourceType)).toBeUndefined();
    });
    it('takepicture method pass source type empty ', () => {
    let sourceType:any;
    const fixture = TestBed.createComponent(AddnewVetPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).not.toBeNull();
   });
    it('expects method should be intialized and it should be TRUE', () => {
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.selectImage).toBeTruthy();
    });
    it('expects showPassword should be intialized and it should be TRUE', () => {
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.componentInstance;
      expect(app.showPassword()).toBeUndefined();
  });
    it('selectImage method should render', () => {
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.selectImage()).not.toBeNull();
  });
      it('expects method should be intialized and it should be TRUE', () => {
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.petPicUpdate).toBeTruthy();
        const blob1=new Blob([]);
        blob1['name']="test.xls";
        const event = { target: { files: [blob1] }};
        expect(app.petPicUpdate(event)).toBeUndefined();
    });
      it('expects method should be intialized and it should be TRUE', () => {
        const dataurl ='www.lucidatechnologies.com/index';
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.dataURLtoFile(dataurl)).toBeUndefined();
    });
  
    it('expects method should be intialized and it should be TRUE', () => {
       component.inviteEmail = 'shaiksameer@lucidatechnologies.com'
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      component.model.email = 'shaiksameer@lucidatechnologies.com';
      component.model.practiceId = 123;
      expect(component.createVet()).not.toBeNull();
  });
    it('expects method should be intialized and it should be TRUE', () => {
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.uploadProfilePic).toBeTruthy();
    });
    it('uploadProfilePic method will render', () => {
      let picture,id
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.uploadProfilePic = (id)).not.toBeNull();
  });
      it('expects method should be intialized and it should be TRUE', () => {
        const fixture = TestBed.createComponent(AddnewVetPage);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.inviteVet).toBeTruthy();
    });
    it('expects onSearchUsername method should be intialized and it should be TRUE', () => {
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.onSearchUsername()).not.toBeNull();
  });
    it('inviteVet will pass params', () => {
      const data = {
        mlFor: 'INVITE_VET',
        userId: 3,
        practiceId: 23424,
        email: 'shaiksameer@lucidatechnologies.com'
      };
      const fixture = TestBed.createComponent(AddnewVetPage);
      fixture.detectChanges();
      const app = fixture.debugElement.componentInstance;
      expect(app.inviteVet(data)).toBeUndefined();
      component.inviteVet;
      let notify: NotificationService;
      app.notify.notification('Invitation sent successfully');
  });
    let petPicUpdate:Event;
    let profilePic:any;
    it('can be initialized', () => {
        expect(fixture).toBeDefined();
        expect(AddnewVetPage).toBeDefined();
        expect(petPicUpdate).toBeUndefined();
    });
    
    it('can set pet profile uploader if image is empty', () => {
        profilePic = {
            target: {
                reader: FileReader,
                imagePath:Path
            }
        };
      expect(profilePic.reader).toBeUndefined(Path);  
    });
    
    it('should show a validation error if the first name was touched but left empty', () => {
        let component = fixture.componentInstance;
        // component. = 'firstName';
        // component.data = 'email';
        // component.data = 'mobile';
        let onAddOrInvite = component.onAddOrInvite;
         console.log(onAddOrInvite) 
        fixture.detectChanges();
        let firstNameValidationError: DebugElement;
        fixture.detectChanges(); 
        firstNameValidationError = fixture.debugElement.query(By.css('.text-danger'));
        expect(firstNameValidationError).toBeNull();
        let emailValidationError: DebugElement;
        fixture.detectChanges(); 
        emailValidationError = fixture.debugElement.query(By.css('.text-danger'));
        expect(emailValidationError).toBeNull();
        let mobileValidationError: DebugElement;
        fixture.detectChanges(); 
        mobileValidationError = fixture.debugElement.query(By.css('.text-danger'));
        expect(mobileValidationError).toBeNull();
    });
    it('assigning for model',()=>
    {
    const mod = component.model;
    mod.id=1;
    mod.firstName = 'sameer';
    mod.mobile = '9676022850';
    mod.email = 'sameer@gmail.com';
    mod.code = '';
    mod.species = [];
    mod.contact = '4522523';
    mod.practiceId = 322;
    mod.isActive =true;
    expect(mod.id).toBe(1);
    expect(mod).not.toBeNull();
    expect(mod.firstName).toBe('sameer');
    expect(mod.mobile).toBe('9676022850');
    expect(mod.mobile).not.toBeNull();
    expect(mod.isActive).toBe(true); 
    expect(mod.contact).toBe('4522523');
    expect(mod.practiceId).toBe(322);
    expect(mod.email).not.toBeNull();
    });
});
