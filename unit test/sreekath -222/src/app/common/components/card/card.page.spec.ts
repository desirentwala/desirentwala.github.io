import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardPage } from './card.page';

describe('CardPage will render', () => {
  let component: CardPage;
  let fixture: ComponentFixture<CardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should render ngOnDestroy", () => {
    const fixture = TestBed.createComponent(CardPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnChanges').and.callFake(() => console.log('fake ngOnChanges'));
  });
  it("should render ngOnInit", () => {
    const fixture = TestBed.createComponent(CardPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnInit').and.callFake(() => console.log('fake ngOnInit'));
  });
  it("should render onSelect", () => {
     let Pet
    const fixture = TestBed.createComponent(CardPage);
    fixture.detectChanges();
    let  component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.onSelect(Pet)).not.toBeNull();
  });
  it("should render ngOnChanges", () => {
   const fixture = TestBed.createComponent(CardPage);
   fixture.detectChanges();
   let  component = fixture.componentInstance;
   fixture.detectChanges();
   expect(component.ngOnChanges()).not.toBeNull();
 });
});
