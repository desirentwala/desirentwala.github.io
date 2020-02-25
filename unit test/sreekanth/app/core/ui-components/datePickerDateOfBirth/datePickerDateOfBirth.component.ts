import { TooltipModule } from '../tooltip/index';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { DateDuration } from '../ncp-date-picker/pipes/date.duration';
import { DateFormatService } from '../ncp-date-picker/services/ncp-date-picker.date.format.service';
import { NcpDatePicker } from '../ncp-date-picker/ncp-date-picker.component'
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { NcpDatePickerModule } from '../ncp-date-picker/ncp-date-picker.module';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';

const noop = () => {
};

export const CUSTOM_DOB_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerDateOfBirthComponent),
    multi: true
};

@Component({

    selector: 'datepickerdob',
    templateUrl: './datePickerDateOfBirth.html',
    providers: [CUSTOM_DOB_VALUE_ACCESSOR, DateFormatService]
})

export class DatePickerDateOfBirthComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
    @Input() elementId: string;
    @Input() ageControl: FormControl;
    @Input() placeHolder: string;
    @Input() mandatoryFlag: boolean = false;
    @Input() elementValue: any;
    @Input() customFlag: boolean = false;
    @Input() dobCustomClass: string = '';
    @Input() changeId: string = '';
    @Input() fieldTabId: any;
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() options: Object = {};
    @Input() datepickerClass: string = '';
    @Input() overwriteNonGregorianType: boolean = false;
    @Input() nonGregorianType: string = '';
    elementControl = new FormControl();
    dobDate = new FormControl();
    public innerValue;
    months: any[] = [];
    years: any[] = [];
    days: any[] = [];
    public day = '';
    public month = '';
    public year = '';
    public age;
    config;
    utils: UtilsService;
    readOnlyFlag: boolean = false;
    invalidFlag: boolean;
    myDatePickerNormalOptions = {
        todayBtnTxt: 'Today',
        firstDayOfWeek: 'mo',
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate(), dayTxt: '' }
    };
    ngOnInit() {
        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.ele.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                }
            }
        });
        if (!this.options) {
            this.options = this.myDatePickerNormalOptions;
        }
        else {
            Object.keys(this.myDatePickerNormalOptions).forEach(key => this.options[key] = this.options[key] ? this.options[key] : this.myDatePickerNormalOptions[key]);
        }
    }



    constructor(configservice: ConfigService, _utils: UtilsService, public dateFormatService: DateFormatService,
        public dateduration: DateDuration, public eventHandler: EventService, public ele: ElementRef) {
        this.config = configservice;
        this.utils = _utils;
    }

    ngAfterViewInit() {
        this.dobDate.valueChanges.subscribe(data => {
            if (data) {
                let selectedDate = this.dateduration.transform(data).startDate;
                let day, month, year;
                if (selectedDate) {
                    day = selectedDate.getDate();
                    month = selectedDate.getMonth() + 1;
                    year = selectedDate.getFullYear().toString();

                    month = this.formatMonth(month);
                    day = this.formatDay(day);

                    this.daymonthyearSelected(day, month, year);
                }
            }
        });
    }
    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;


    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }
    ngOnChanges(changes?) {
        this.value = this.elementValue && this.elementValue !== undefined ? this.elementValue : this.value;
        this.writeValue(this.value);
    }

    writeValue(value: any) {
        if (value) {
            let date;
            date = this.dateduration.transform(value).startDate;

            let dateString;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            this.month = this.formatMonth(month);
            this.day = this.formatDay(day);
            this.year = date.getFullYear().toString();

            dateString = this.dateFormatService.formatDate(date);
            this.value = dateString;
            this.dobDate.patchValue(dateString);
            this.daymonthyearSelected(this.day, this.month, this.year);

        } else {
            this.day = '';
            this.month = '';
            this.year = '';
            this.age = '';
            this.value = '';
            this.dobDate.patchValue('');
        }
    }


    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
        // this.elementControl.valueChanges.subscribe();
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    formatMonth(_month: number): string {
        let month = '';
        if (_month < 10) {
            month = '0' + _month;
        } else {
            month = _month.toString();
        }

        return month;
    }

    formatDay(_day: number): string {
        let day = '';
        if (_day < 10) {
            day = '0' + _day;
        } else {
            day = _day.toString();
        }

        return day;

    }


    daymonthyearSelected(day: string, month: string, year: string) {
        if (day !== null && month !== null && year !== null && day !== undefined && month !== undefined && year !== undefined) {
            if (day.length > 0 && month.length > 0 && year.length > 0) {
                let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                let dateString;
                let _day = date.getDate();
                let _month = date.getMonth() + 1;
                this.month = this.formatMonth(_month);
                this.day = this.formatDay(_day);
                this.year = date.getFullYear().toString();

                dateString = this.dateFormatService.formatDate(date);
                this.value = dateString;
                this.ageControl.markAsDirty({onlySelf: true});
                this.ageControl.markAsTouched({onlySelf: true});
                this.age = this.getAge(day, month, year);
                this.ageControl.setValue(this.age);
            } else {
                this.ageControl.reset();
                this.ageControl.updateValueAndValidity();
                this.value = '';
            }
            this.eventHandler.setEvent('change', this.changeId, this.innerValue);
        }
    }

    setDate(age: number) {
        this.day = '';
        this.month = '';
        this.year = '';
        this.value = '';
        this.age = age;
    }

    getAge(_day: string, _month: string, _year: string): number {

        let today = new Date();
        let age = today.getFullYear() - parseInt(_year);
        let monthgap = today.getMonth() + 1 - parseInt(_month);
        let todayDay = today.getDate();
        if (monthgap < 0 || (monthgap === 0 && todayDay < parseInt(_day))) {
            age--;
        }
        if (age < 0) {
            age = 0;
        }
        let classNames: string = this.ele.nativeElement.className;
        if (classNames && classNames.includes('ng-valid')) {
            this.invalidFlag = false;
        }
        return age;
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.ageControl.disable();
            this.readOnlyFlag = true;
        } else {
            this.ageControl.enable();
            this.readOnlyFlag = false;
        }
    }

    ngOnDestroy() {
        this.eventHandler.validateTabSub.observers.pop();;
    }


}
export const UI_DOB_DIRECTIVES = [DatePickerDateOfBirthComponent];
@NgModule({
    declarations: UI_DOB_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, TooltipModule, NcpDatePickerModule],
    exports: [UI_DOB_DIRECTIVES, SharedModule]
})
export class UiDatePickerDateOfBirthModule { }