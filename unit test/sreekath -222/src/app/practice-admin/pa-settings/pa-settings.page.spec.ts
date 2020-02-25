import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaSettingsPage } from './pa-settings.page';
import { ApptTypeTablePage } from '../../common/components/appt-type-table/appt-type-table.page';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PaSettingsPage', () => {
  let component: PaSettingsPage;
  let fixture: ComponentFixture<PaSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaSettingsPage,ApptTypeTablePage ],
      imports: [IonicModule.forRoot(),FormsModule,HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PaSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render "ionViewWillEnter"', () => {
    const val = '';
    const fixture = TestBed.createComponent(PaSettingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.ionViewWillEnter(val)).toBeUndefined();
    expect(app.ionViewWillEnter(val)).not.toBeNull();
    expect(component.ionViewWillEnter()).toBeUndefined();
  });
  it('should render "ionViewWillEnter"', () => {
    const navigation = '';
    const index  = 1;
    const fixture = TestBed.createComponent(PaSettingsPage);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.selecteByRoute(navigation,index)).toBeUndefined();
    expect(app.selecteByRoute(navigation,index)).not.toBeNull();
    expect(component.selecteByRoute(navigation,index)).toBeUndefined();
  });
});
