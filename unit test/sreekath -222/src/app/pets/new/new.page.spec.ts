import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPage } from './new.page';
import { Pet } from '../pet.model';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from '../../common/services/common.service';
import { PetService } from '../pets.service';
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { MockBackend,MockConnection } from '@angular/http/testing';
import { MockPetService } from "../mock.pets.service";
import {DebugElement} from "@angular/core"; 
import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
import { IonicStorageModule} from '@ionic/storage';
describe('new pet page should render', () => {
  let component: NewPage;
  let fixture: ComponentFixture<NewPage>;
  let CommonService:CommonService;
  let service:MockPetService;
  let mockBackend: MockBackend;
  
  const  Path = '../../../assets/profile-picture.png';
  let imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  let allVets: any = [];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ NewPage ],
      imports: [IonicModule.forRoot(), FormsModule,RouterTestingModule,HttpClientTestingModule,IonicStorageModule.forRoot()],
      providers: [MockPetService,{provide:XHRBackend,useClass:MockBackend}]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NewPage);
      component = TestBed.createComponent(NewPage).componentInstance;
      //CommonService = TestBed.get(CommonService.getStorage.id);
      fixture.detectChanges();
     });
    service = TestBed.get(MockPetService);
    fixture = TestBed.createComponent(NewPage);
    mockBackend=TestBed.get(XHRBackend);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let id ={};
       const getStorages = {
        getStorage: (key: string): string => {
           return key in id ? id[key] : null;
         },
         setId: (key: string, value: string) => {
           id[key] = `${value}`;
         },
         removeId: (key: string) => {
           delete id[key];
         },
         clear: () => {
           id = {};
         }
       }; 
  }));
  beforeEach(async () => {
    component.ngOnInit();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture).toBeTruthy();
  });
  
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit).toBeTruthy();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    let sourceType:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.takePicture(sourceType)).toBeUndefined();
  });
  it("expects allVets Variable", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.allVets).toBeTruthy()
  });
  it("expects ionViewWillEnter Variable", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter).toBeTruthy()
  });
  it("expects ionViewWillEnter Variable", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).not.toBeNull()
  });
  it("expects ionViewWillEnter Variable", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter()).toBeUndefined();
  });
  it("expects createPet meethod should render", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.createPet).toBeTruthy()
  });
  it("expects onSearchChange meethod should render", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onSearchChange()).not.toBeNull()
  });
  it("expects createPet meethod should render", () => {
    let param:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.createPet(param)).toBeUndefined()
  });
  it("expects createPet meethod should render", () => {
    let param:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.createPet(param)).not.toBeNull()
  });
  it("expects retrivePet details", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.retrivePet).toBeTruthy()
  });
  it("slot should be execute", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    let id = 5
    expect(component.retrivePet(id)).toBeUndefined();
  });
  it("slot should be execute", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    let id = 5
    expect(component.retrivePet(id)).not.toBeNull();
  });
  it("expects getPetById details", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPetById).not.toBeNull()
  });
 
  it("should show a validation error if the form was touched", () => {
    let component = fixture.componentInstance;
    let petList = service.getPetList();
    // let petName = petList.petName;
    // let dob = petList.dob;
    // let gender = petList.gender;
    fixture.detectChanges();
    let petNameValidationError: DebugElement;
    fixture.detectChanges();
    petNameValidationError = fixture.debugElement.query(
      By.css(".text-danger")
    );
    expect(petNameValidationError).toBeNull();
    let DateOfBirthValidationError: DebugElement;
    fixture.detectChanges();
    DateOfBirthValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(DateOfBirthValidationError).toBeNull();
    let genderValidationError: DebugElement;
    fixture.detectChanges();
    genderValidationError = fixture.debugElement.query(By.css(".text-danger"));
    expect(genderValidationError).toBeNull();
  });
  it("expects image picker options should be true", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.imagePickerOptions).toBeTruthy();
  });
  it("expects selectedSpecies options should be true", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectedSpecies).toBeTruthy();
  });
  it("expects selectedSpecies pass param should be true", () => {
    let speciesData:any;
    let i: any
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    let speciesId = 5
    expect(app.selectedSpecies(speciesData, i)).toBeUndefined();
    expect(app.speciesData).toBeUndefined();
   // this.pet.speciesId = speciesData.speciesId;
   expect(app.selectedSpecies(speciesId)).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage).toBeTruthy();
  });
  it("expects method should be pass param", () => {
    let url:any
    let petList = service.getPetList();
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selectImage(petList)).not.toBeNull();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.neutered).toBeTruthy();
  });
  it("expects method should pass peram", () => {
    let petList = service.getPetList();
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   expect(app.neutered()).not.toBeNull();
  });
  it("expects onPrevious should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious).toBeTruthy();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).toBeUndefined();
  });
  it("expects onPrevious should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onPrevious(speciesData)).not.toBeNull();
  });
  it("expects onNext should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext).toBeTruthy();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).toBeUndefined();
  });
  it("expects onNext should be pass @param", () => {
    let speciesData:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.onNext(speciesData)).not.toBeNull();
  });
  // it("expects search should be pass @param", () => {
  //   let val:any;
  //   const fixture = TestBed.createComponent(NewPage);
  //   fixture.detectChanges();
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.search(val)).toBeUndefined();
  // });
  // it("expects search should be pass @param", () => {
  //   let val:any;
  //   const fixture = TestBed.createComponent(NewPage);
  //   fixture.detectChanges();
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.search(val)).not.toBeNull();
  // });
  it("expects hideList should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.hideList).toBeTruthy();
  });
  it("expects hideList should be pass @param", () => {
    const selectedPractice = { practiceName:'sri Vinayaka Clinic'};
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.hideList(selectedPractice)).toBeUndefined();
  });
  it("expects hideList should be pass @param", () => {
    let selectedPractice:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.hideList('')).not.toBeNull();
  });
  it("expects navigatetoCreate should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigatetoCreate).toBeTruthy();
  });
  it("expects navigatetoCreate should be pass @param", () => {
    let selectedPractice:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.navigatetoCreate(selectedPractice)).toBeUndefined();
    expect(app.navigatetoCreate(selectedPractice)).not.toBeNull();
  });
  it("expects backtoStep1 should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.backtoStep1).toBeTruthy();
  });
  it("expects backtoStep1 should be pass @param", () => {
    let addPracticeDetails:any;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.backtoStep1(addPracticeDetails)).toBeUndefined();
    expect(app.backtoStep1('')).not.toBeNull();
  });
  it("expects dateValidation should be intialized and it should be TRUE", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.dateValidation).toBeTruthy();
  });
  it("expects backtoStep1 should be pass @param", () => {
     const date  = { target : {value : '14-02-2020'}}
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.dateValidation(date)).toBeUndefined();
    expect(app.dateValidation('')).not.toBeNull();
  });
  it("expects datevalidatio should be pass @param", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    spyOn(app,'dateValidation').and.callFake(() => console.log('fake dateValidation'));
  });
  it("expects method should be intialized and it should be TRUE", () => {
    const picture = {'size': 3}
    const id      = 122;
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic).toBeTruthy();
  });
  it("expects method should be intialized and it should be TRUE", () => {
    let picture='image.png'
    let id = 57
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.uploadProfilePic).not.toBeNull();
    app.uploadProfilePic = 'image.png';
    app.uploadProfilePic = '57';
  });
  let petPicUpdate: Event;
  let profilePic: any;
  it("can be initialized", () => {
    expect(fixture).toBeDefined();
    expect(NewPage).toBeDefined();
    expect(petPicUpdate).toBeUndefined();
  });
  it("can be initialized", () => {
    const fixture = TestBed.createComponent(NewPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.petPicUpdate).not.toBeNull();
  });

  it("can set pet profile uploader if image is empty", () => {
    profilePic = {
      target: {
        reader: FileReader,
        imagePath: Path
      }
    };
    expect(profilePic.reader).toBeUndefined(Path);
  });

  // it('should render image for desktop', async(() => {
  //   const fixture = TestBed.createComponent(NewPage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.desktop-logo>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  // }));
  // it('should render the image for mobile', async(() => {
  //   const fixture = TestBed.createComponent(NewPage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.col-12>img').src).toContain('http://localhost:9876/assets/imgs/mobile-logo.png');
  // }));
  it("petData fetching from MockPetService", () => {
    // let data = service.getPetList().userId = 5;
      let petList = service.getPetList();
    
    // Arrange
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
 

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: petList
          })
        )
      );
    });
  });
  // it('exhisting petinfo should fetch', () => {
  //   expect(component).toBeTruthy();
  //   const fixture = TestBed.createComponent(NewPage);
  //   fixture.detectChanges();
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.getPetInfo).toBeTruthy(); 
  // });
  it('assigning for model',()=>
{
const mod=component.pet;
mod.id=1;
mod.userId=121212;
mod.petName =  'alexa';
mod.speciesId = 2312312;
mod.practiceId = 23423443;
mod.practice = 'apllo clinic';
mod.breed = 'biscut';
mod.gender =  'male';
mod.dob = new Date;
mod.profilePic = 'image.png';
mod.neutered = true;
mod.deceased = false;
mod.hide = true;
mod.active = false;
mod.insured= true;
mod.insurenceProvider = 'yes';
expect(mod.id).toBe(1);
expect(mod).not.toBeNull();
 expect(mod.userId).toBe(121212);
//   appointments: Array<any> = [];
//   slot: { id: number, isPrivate: boolean, vet: string, duration: string, startsAt: string,
//     practiceAppointmentTypeId: number, appointmentType: string, originalDateTime: any };
//   oldSlotId?: number;
// practiceName: any;

});
it("showmore should be exist", () => {
  const fixture = TestBed.createComponent(NewPage);
  fixture.detectChanges();
  const app = fixture.debugElement.componentInstance;
  expect(app.storage.get('ONBOARD_PO').then((val) => {
    app.router.navigateByUrl('/pets/new');
  }));
});




it('validate gender',()=>{


  expect(component.validateGender('ev')).toBeUndefined();
  
    setTimeout(() => {
      if (!component.pet.gender) {
        expect(component.isGender).toBeUndefined();
      } else {
        expect(component.isGender).toBeUndefined();
      }
    }, 3000);
  })





  it('data by url',()=>{
  expect(component.dataURLtoFile('url')).toBeUndefined();
  });


it('petPicUpdate will update',()=>
{
  const blob1=new Blob([]);
  blob1['name']="test.xls";
  const event = { target: { files: [blob1] }};
  expect(component.petPicUpdate(event)).toBeUndefined();
})
});

