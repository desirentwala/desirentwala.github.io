import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  inject
} from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  HttpModule,
  XHRBackend,
  Response,
  ResponseOptions,
  RequestMethod
} from "@angular/http";

import { MockBackend, MockConnection } from "@angular/http/testing";
import { AuthService } from "src/app/common/services/auth.service";
import { Observable } from "rxjs";

import { VhdTableComponent } from "./vhd-table.component";
import { BrowserModule } from "@angular/platform-browser";
import { EditVetPage } from "../../common/components/edit-vet/edit-vet.page";
import { EditPetOwnerPage } from "../../common/components/edit-pet-owner/edit-pet-owner.page";
import { EditPetPage } from "../../common/components/edit-pet/edit-pet.page";
describe("VhdTableComponent will Render", () => {
  let component: VhdTableComponent;
  let fixture: ComponentFixture<VhdTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VhdTableComponent,
        EditVetPage,
        EditPetOwnerPage,
        EditPetPage
      ],

      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        HttpModule,
        IonicModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VhdTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).not.toBeNull();
  });

  it("checking next function", () => {
    const contents = {'id':1212}
    const result = component.onNext(contents);
    expect(result).not.toBeNull();
  });

  it("checking previous function", () => {
    const contents = {id:1212}
    const result = component.onPrevious(contents);

    expect(result).not.toBeNull();
  });
  it(" onPrevious", () => {
    const id = 12333;
    expect(component.onPrevious(id)).toBeUndefined();
    let cont = component.contents;
    cont = [
      { appointment: "standard", id: 1, start: 4 },
      { appointment: "standard", id: 2, start: 5 }
    ];

    cont.map(data => {
      if (id === data.id && data.start !== 0) {
        data.start -= 1;
        data.end -= 1;
      }
    });
  });
  it(" onNext", () => {
    let id: any;
    expect(component.onNext(id)).toBeUndefined();
    let cont = component.contents;
    cont = [
      {
        appointment: "standard",
        id: 1,
        start: 4,
        pets: [{ id: 20, petName: "Dolly 12", practiceId: 2 }]
      },
      { appointment: "standard", id: 2, start: 5 }
    ];

    if (cont != undefined) {
      cont.map(data => {
        if (id === data.id && data.end < data.pets.length) {
          data.start += 1;
          data.end += 1;
          data.images = data.pets.slice(data.start, data.end);
        }
      });
    }
  });

  it("inputs", () => {
    expect(component.contents).toBeUndefined();
    expect(component.header).toBeUndefined();
    expect(component.interval).toBeUndefined();
  });

  it("ionwillenter", () => {
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.ngOnInit).toBeTruthy();
  });

  it(" ionViewDidLeave ", () => {
    expect(component.ionViewDidLeave()).toBeUndefined();
  });
  it("ngOnChanges() ", () => {
    expect(component.ngOnChanges()).toBeUndefined();
  });

  it("ion will enter", () => {
    const com = component.ionViewWillEnter();
    expect(com).toBeUndefined();
    let data: [
      {
        id: 2;
        name: "Murali PO";
        email: "murali@agkiya.cloud";
        mobile: "01238710000";

        pets: [
          {
            id: 20;
            petName: "Dolly 12";
            practiceId: 2;
            profilePic: "../../../assets/user-avatar.svg";
          }
        ];
        start: 0;
        end: 3;
      }
    ];

    component.contents = data;

    if (component.contents != undefined) {
      expect(component.contents).not.toBeUndefined();
    }
  });

  it("onprevious", () => {
    let data: [
      {
        id: 2;
        name: "Murali PO";
        email: "murali@agkiya.cloud";
        mobile: "01238710000";

        pets: [
          {
            id: 20;
            petName: "Dolly 12";
            practiceId: 2;
            profilePic: "../../../assets/user-avatar.svg";
          }
        ];
        start: 0;
        end: 3;
      }
    ];
    let id = 1;
    component.contents = data;
    expect(component.onPrevious(1)).not.toBeNull();

    if (component.contents != undefined) {
      expect(component.contents).not.toBeNull();
      data.map(da => {
        if (id === da.id && da.start !== 0) {
          // da.start -= 1;
          // da.end -= 1;
          // da.images = da.pets.slice(da.start, da.end);
        }
      });
    }
  });
  it("editPet method should render", () => {
    const data = {id:12121};
    const val  = 23423
    const fixture = TestBed.createComponent(VhdTableComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['editPet'] ;
    expect(comp.editPet(data,val)).not.toBeNull();
  });
  it("edit method should render", () => {
    const type = 'vets';
    const val  = 23423;
    const fixture = TestBed.createComponent(VhdTableComponent);
    fixture.detectChanges();
    var comp = fixture.componentInstance;
    comp['edit']  ;
    expect(comp.edit(type,val)).not.toBeNull();
    expect(comp.edit(type,val)).toBeUndefined()
  });
  it("data method should render", () => {
    const fixture = TestBed.createComponent(VhdTableComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['data']  = '';
    expect(comp.edit).not.toBeNull();
  });
  it("type method should render", () => {
    const fixture = TestBed.createComponent(VhdTableComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['type']  = '';
    expect(comp.type).not.toBeNull();
  });
  it("delete method should render", () => {
    const data = {'id':12121};
    const fixture = TestBed.createComponent(VhdTableComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['delete'] ;
    expect(comp.delete(data)).not.toBeNull();
  });
  it("add method should render", () => {
    const val  = 23423;
    const fixture = TestBed.createComponent(VhdTableComponent);
    fixture.detectChanges();
    var  comp = fixture.componentInstance;
    comp['add'] ;
    expect(comp.add(val)).not.toBeNull();
  });
  it("update method should render", () => {
    const fixture = TestBed.createComponent(VhdTableComponent);
    fixture.detectChanges();
    var comp = fixture.componentInstance;
    comp['update'] ;
    expect(comp.update()).not.toBeNull();
  });
});
