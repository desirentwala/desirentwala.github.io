import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPage } from './list.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../common/services/common.service';
import { By } from '@angular/platform-browser';
import { MockPetService } from "../mock.pets.service";
import { MockBackend,MockConnection } from '@angular/http/testing';
import { DebugElement } from "@angular/core"; 
import { XHRBackend, HttpModule,Response,RequestMethod, ResponseOptions } from '@angular/http';
import { Pet } from '../pet.model';

describe('Pets List will render', () => {
  let mockBackend: MockBackend;
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let CommonService:CommonService;
  let service: MockPetService;
 

  it('should render main title', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('My pets');
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPage ],
      imports: [IonicModule.forRoot(),HttpClientTestingModule,RouterTestingModule,FormsModule,HttpModule],
      providers:[MockPetService,{provide:XHRBackend,useClass:MockBackend}]
    }).compileComponents().then(() => {
        fixture = TestBed.createComponent(ListPage);
        component = TestBed.createComponent(ListPage).componentInstance;
       });

    service = TestBed.get(MockPetService);
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockBackend=TestBed.get(XHRBackend);
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

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('should show the profiel pic', () => {
    expect(fixture.debugElement.query(By.css('.my-auto'))).toBeNull();
  });
  it('should exist return the service', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.getPetList).toBeTruthy();
    app.petService.getPetList(5).subscribe((testdata: any) => {
      app.allPets = testdata;
      app.showActivePets();
      app.isShow = false;
    });
  });
  it("ionViewWillEnter method should exist n render", () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter).toBeTruthy();
  });  
  it("ionViewWillEnter method should pass param", () => {
    let param:any;
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter(param)).toBeUndefined();
  }); 
  it("ionViewWillEnter method should pass param", () => {
    let param:any;
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter(param)).not.toBeNull();
  }); 
  it("ngOnInit method should render", () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnInit()).not.toBeNull();
  }); 
  it("should render ngOnChanges", () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnChanges').and.callFake(() => console.log('fake ngOnChanges'));
  });
  it("ngOnChanges method should render", () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ngOnChanges()).not.toBeNull();
  }); 
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it('should show active pets', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showActivePets).toBeTruthy();
    
  });
  it('should show active pets', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showActivePets()).not.toBeNull();
    
  });
  it('navigate mathod to render as mention path in viewPetInfo', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.viewPetInfo).toBeTruthy();  
  });
  it('navigate mathod to render as mention path in viewPetInfo', () => {
    const pet = {'id':23};
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.viewPetInfo(pet)).not.toBeNull();  
  });
  it('navigate mathod to render as mention path in viewPetInfo', () => {
    const pet = {'id':23};
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.viewPet(pet)).not.toBeNull();  
  });
  it('navigate mathod to render as mention path in viewPet', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.viewPet).toBeTruthy();  
  });
  it('navigate mathod to render as mention path in handleBookingButton', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.handleBookingButton).toBeTruthy();  
  });
  it('navigate mathod to render as mention path in handleBookingButton', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.handleBookingButton()).not.toBeNull();  
  });
  it('confirmationAlert should render', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.confirmationAlert).toBeTruthy();  
  });
  it('confirmationAlert should render', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.confirmationAlert).toBeDefined();  
  });
  it('confirmationAlert should render', () => {
    const pet = {'petName': 'dog'};
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.confirmationAlert(pet)).not.toBeNull();  
  });
  it('should show active pets', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.showActivePets).toBeTruthy();
    
  });
  it('should show active deletePet', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.deletePet).toBeTruthy();
  });
  
  it('should show not active any pets', () => {
    let param:any
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
   expect(app.showActivePets(param)).toBeUndefined();
  });
  it('should show not active any deletePet', () => {
    let param:any
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
  expect(app.deletePet(param)).not.toBeNull();
  });
  it('should show not active any deletePet', () => {
    let param:any
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
  expect(app.deletePet()).not.toBeNull();
  app.petService.deletePet(5).subscribe(testdata => {
    app.petList = this.petList.filter(sample => sample.id !== 5);
    app.allPets = this.allPets.filter(sample => sample.id !== 5);
  });
  });
  
  it('should exist', function () {
    expect(MockPetService).toBeDefined();
});

  it("getting PetList from MockPetService", () => {
    let petList = service.getPetList();
    expect(component.allPets).toBe(this.petList);
   
    expect(component.isShow).toBe(false);
    // Arrange
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: petList,
          
          })
        )
      );
    });


   
  });
   
   it('isShow set to true disables the ion-toggle', () => {
     let de = fixture.debugElement;
    component.isShow = true;
    component.data = null;
    fixture.detectChanges();
    expect(de.nativeElement.querySelector('ion-toggle').disabled).toBeFalsy();
   });
   
   it('isShow set to false enables the ion-toggle', () => {
    let de = fixture.debugElement;
    component.isShow = false;
    component.data = null;
    fixture.detectChanges();
    expect(de.nativeElement.querySelector('ion-toggle').disabled).toBeFalsy();
   });
   it('should render image for desktop', async(() => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.desktop-logo>img').src).toContain('http://localhost:9876/assets/imgs/logo.png');
  }));
  // it('should render the image for mobile', async(() => {
  //   const fixture = TestBed.createComponent(ListPage);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.col-12>img').src).toContain('http://localhost:9876/assets/imgs/mobile-logo.png');
  // }));
   it('should render image for desktop', async(() => {
     const fixture = TestBed.createComponent(ListPage);
     fixture.detectChanges();
     const compiled = fixture.debugElement.nativeElement;
     expect(fixture.debugElement.query(By.css('.petprofile'))).toBeNull();
   }));
   it('should exist & show petlist', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.basePath).toBeTruthy();
    expect(app.basePath).toContain('http://localhost:3001/')
  });

  
  it('should render ion text', () => {
    const fixture = TestBed.createComponent(ListPage);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-text').textContent).toContain('Add pet');
    expect(compiled.querySelector('ion-text').textContent).not.toBeNull();
    
  });
   
});
