import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule }  from '@angular/forms';
import {NgModule} from '@angular/core';
import {NcpDatePicker} from './ncp-date-picker.component';
import { DateFormatService } from './services/ncp-date-picker.date.format.service';
import { DateDuration } from './pipes/date.duration';
import {LocaleService} from './services/ncp-date-picker.locale.service';
import { DateValidatorService } from './services/ncp-date-picker.date.validator.service';
import { TooltipModule } from "../tooltip/index";
import { ClickOutSideModule } from '../directives/clickOutside.directive';
import { UiMiscModule } from '../misc-element/misc.component';
import { DisplayDate } from './pipes/display.date';

@NgModule({
    imports: [ CommonModule, FormsModule, ReactiveFormsModule,TooltipModule,ClickOutSideModule, UiMiscModule],
    declarations: [ NcpDatePicker,DateDuration,DisplayDate ],
    exports: [ NcpDatePicker],
    providers: [DateFormatService,DateDuration,DisplayDate,LocaleService, DateValidatorService],
})
export class NcpDatePickerModule { }
