import { TooltipModule } from '../tooltip/index';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { DateDuration } from '../ncp-date-picker/pipes/date.duration';
import { DateFormatService } from '../ncp-date-picker/services/ncp-date-picker.date.format.service';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    HostListener,
    Input,
    NgModule,
    OnDestroy,
    OnInit
} from '@angular/core';
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
    useExisting: forwardRef(() => DateofbirthComponent),
    multi: true
};

@Component({

    selector: 'dateof-birth',
    templateUrl: './dateofbirth.html',
    providers: [CUSTOM_DOB_VALUE_ACCESSOR, DateFormatService]
})

export class DateofbirthComponent implements ControlValueAccessor, OnInit, OnDestroy {
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
    @Input() defaultYear: boolean = true;
    @Input() minimumAgeGap: number = 18;
    @Input() hideAgeControl: boolean = false;
    @Input() elementLabel: string; 
    elementControl = new FormControl();
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
    presentYear: number;
    listOfDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    isLeapYear: boolean = false;
    ascOrDescFlag: boolean = false;
    ngOnInit() {
        for (let i = 1; i <= 31; i++) {
            if (i < 10) {
                this.days[i - 1] = '0' + i;
            } else {
                this.days[i - 1] = i;
            }
        }
        for (let i = 1; i <= 12; i++) {
            if (i < 10) {
                this.months[i - 1] = '0' + i;
            } else {
                this.months[i - 1] = i;
            }
        }
        let date = new Date();
        this.presentYear = date.getFullYear();
        let j = 0;
        let yearTill = this.presentYear;
		if( this.minimumAgeGap === undefined ) this.minimumAgeGap = 18;
        if (this.defaultYear === false) yearTill = this.presentYear - this.minimumAgeGap;

        if (this.ascOrDescFlag === true) {
            for (let i = 1900; i <= yearTill; i++) {
                this.years[j] = i;
                j++;
            }
        } else {
            for (let i = yearTill; i >= 1900; i--) {
                this.years[j] = i;
                j++;
            }
        }

        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.ele.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                }
            }
        });
    }

    constructor(configservice: ConfigService, _utils: UtilsService, public dateFormatService: DateFormatService,
        public dateduration: DateDuration, public eventHandler: EventService, public ele: ElementRef) {
        this.config = configservice;
        this.utils = _utils;
    }
    // @HostListener("window:scroll", []) onWindowScroll() {
    //     this.DOBYearSelect();
    // }
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
            this.daymonthyearSelected(this.day, this.month, this.year);
            this.invalidFlag = false;
        } else {
            this.day = '';
            this.month = '';
            this.year = '';
            this.age = '';
            this.value = '';

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

    daymonthyearSelected(day: string, month: string, year: string, calledFor?: string) {
        if (calledFor !== undefined) {
            if (calledFor === 'day' && day !== null && day !== undefined) {
                let selectedMonth = <HTMLSelectElement>document.getElementsByClassName('selectMonth');
                // for (let p = 0; p < selectedMonth.length; p++)
                //     this.listOfDaysInMonth.forEach((ele, val) => (<HTMLOptionElement>selectedMonth[p].options[val]).disabled = ele < parseInt(day));
            } else if (calledFor === 'month' && month !== null && month !== undefined) {
                let selectDay = <HTMLSelectElement>document.getElementsByClassName('selectDay');
                // for (let p = 0; p < selectDay.length; p++)
                //     for (let i = 0; i < 31; i++) (<HTMLOptionElement>selectDay[p].options[i]).disabled = (i >= this.listOfDaysInMonth[parseInt(month) - 1]);                
            }
            else if (calledFor === 'year' && year !== null && year !== undefined) {
                this.isLeapYear = this.hasSelectedLeapYear(parseInt(year));
                if (this.isLeapYear) this.listOfDaysInMonth[1] = 29;
            }
        }
        if (day !== null && month !== null && year !== null && day !== undefined && month !== undefined && year !== undefined) {
            if (day.length > 0 && month.length > 0 && year.length > 0) {
                let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                let dateString;
                let _day = date.getDate();
                let _month = date.getMonth() + 1;
                let _year = date.getFullYear();
                let monthString;
                let dayString;
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
        if (this.elementControl.valid) {
            this.invalidFlag = false;
        }
        return age;
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.ageControl.disable();
            this.readOnlyFlag = true;
            this.placeHolder='';
        } else {
            this.ageControl.enable();
            this.readOnlyFlag = false;
        }
    }

    hasSelectedLeapYear(year: number): boolean {
        if (!year) return false;
        if ((!(year % 4) && year % 100) || !(year % 400)) return true;
        return false;
    }

    public DOBYearSelect(): void {
        let manufacturingYearSelect = document.getElementsByClassName("selectYear")[0];
        this.ascOrDescFlag = this.isElementInViewport(manufacturingYearSelect);
        this.years.sort(this.ascOrDescFlag ? this.sortDescending : this.sortAscending);
    }
    isElementInViewport(el) {
        let relaxedHeight;
        if( this.elementId === 'dateofbirth' )  relaxedHeight = -200;
        else relaxedHeight = -545;
        var rect = el.getBoundingClientRect();
        let relativeOffset = rect.top - window.scrollY;
        return (relativeOffset > window.innerHeight / 2) || (relativeOffset < relaxedHeight);
    }
    sortAscending(a, b) { return a - b }
    sortDescending(a, b) { return b - a }

    ngOnDestroy() {
        this.eventHandler.validateTabSub.observers.pop();
    }


}
export const UI_DOB_DIRECTIVES = [DateofbirthComponent];
@NgModule({
    declarations: UI_DOB_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, TooltipModule],
    exports: [UI_DOB_DIRECTIVES, SharedModule],
})
export class UiDateofBirthModule { }