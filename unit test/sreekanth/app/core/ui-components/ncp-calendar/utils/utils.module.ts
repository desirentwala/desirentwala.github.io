import { TaskService } from './task.services';
import { SharedModule } from 'app/core/ui-components/common/shared';
import { UiButtonModule } from './../../button/button.component';
import { LabelModule } from './../../label/label.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@adapters/packageAdapter';
import { CalendarModule } from 'angular-calendar';

import { DateTimePickerComponent } from './ncp-calendar-date-time-picker.component';
import { CalendarHeaderComponent } from './ncp-calendar-header.component';
import { NCPTaskComponent } from './task/ncp-task.component';
import { UiCheckboxModule } from '../../checkbox/checkbox.component';
import { UiRadioModule } from '../../radio/radio.component';
import { NcpDatePickerModule } from '../../ncp-date-picker/ncp-date-picker.module';
import { ErrorModule } from '../../error/error.component';
import { UiTextAreaModule } from '../../textarea/textarea.component';
import { UiTextBoxModule } from '../../textbox/textbox.component';
import { UiTabModule } from '../../tab/tabset';
import { UiTimepickerModule } from '../../time-picker/time-picker.component';
import { UiDropdownModule } from '../../dropdown';
import { CheckboxarrayModule } from '../../checkboxarray';
import { CollapseModule } from '../../collapse/collapse.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
    CalendarModule,
    LabelModule,
    UiCheckboxModule,
    CheckboxarrayModule,
    SharedModule,
    UiTabModule,
    UiTextBoxModule,
    UiTextAreaModule,
    UiDropdownModule,
    ErrorModule,
    NcpDatePickerModule,
    UiRadioModule,
    UiTimepickerModule,
    UiButtonModule,
    CollapseModule
  ],
  declarations: [CalendarHeaderComponent, DateTimePickerComponent, NCPTaskComponent],
  exports: [CalendarHeaderComponent, DateTimePickerComponent, NCPTaskComponent],
  providers: [TaskService],
})
export class NCPCalendarUtilsModule { }
