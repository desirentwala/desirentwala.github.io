import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SlotPage } from './slot/slot.page';
import { CalendarPage } from './calendar/calendar.page';
import { SchedulingService } from './service/scheduling.service';
import { SlotV2Component } from './slot-v2/slot-v2.component';
import { CommonPageModule } from '../common/common.module';
@NgModule({
  declarations: [
    SlotPage,
    CalendarPage,
    SlotV2Component
  ],
  imports: [
    CommonPageModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  exports: [
    SlotPage,
    CalendarPage,
    SlotV2Component
  ],
  providers: [ SchedulingService ]
})
export class SchedulingManagementModule { }
