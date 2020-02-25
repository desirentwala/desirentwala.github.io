import { CheckboxarrayModule } from '../checkboxarray';
import { LabelModule } from '../label/label.component';
import { NCPFormModule } from '../../ncp-forms/ncp.forms.module';
import { SharedModule } from '../../shared/shared.module';
import { UiCheckboxModule } from '../checkbox/index';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ContextMenuModule } from '@adapters/packageAdapter';
import { NgbModalModule } from '@adapters/packageAdapter';
import { NCPCalendarUtilsModule } from './utils/utils.module';
import { ModalModule } from '../modal/index';
import { NCPCalendarComponent } from './ncp-calendar.component';
import { UiTabModule } from '../tab/tabset';
import { UiTextBoxModule } from '../textbox/textbox.component';
import { UiTextAreaModule } from '../textarea/textarea.component';
import { UiDropdownModule } from '../dropdown';
import { ErrorModule } from '../error/error.component';
import { NcpDatePickerModule } from '../ncp-date-picker/ncp-date-picker.module';
import { UiRadioModule } from '../radio/radio.component';
import { UiTimepickerModule } from '../time-picker/time-picker.component';
import { UiButtonModule } from '../button/button.component';
import { UiMiscModule } from '../misc-element/misc.component';
import { CollapseModule } from '../collapse/collapse.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NCPCalendarUtilsModule,
    ModalModule,
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
    UiMiscModule,
    CollapseModule
  ],
  declarations: [NCPCalendarComponent],
  exports: [NCPCalendarComponent]
})
export class UiNCPCalendarModule {}